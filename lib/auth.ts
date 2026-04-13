import bcrypt from "bcryptjs";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  credentialsRegisterSchema,
  credentialsSignInSchema
} from "@/lib/validations/auth";

const DEFAULT_PASSWORD_ROUNDS = 12;
export const googleAuthEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
);

function slugifyUsername(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

async function generateUniqueUsername(seed: string) {
  const base = slugifyUsername(seed) || "player";
  let candidate = base;
  let index = 1;

  while (index <= 20) {
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true }
    });

    if (!existing) {
      return candidate;
    }

    index += 1;
    candidate = `${base}-${index}`;
  }

  return `${base}-${Date.now().toString().slice(-6)}`;
}

function getDisplayName(email: string, name?: string | null) {
  if (name?.trim()) {
    return name.trim();
  }

  const local = email.split("@")[0] ?? "Player";

  return local
    .split(/[._-]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, DEFAULT_PASSWORD_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function toAdapterUser(user: {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: Date | null;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    emailVerified: user.emailVerified
  } satisfies AdapterUser;
}

function createPrismaAuthAdapter(): Adapter {
  return {
    createUser: async (data: Omit<AdapterUser, "id">) => {
      const email = data.email?.toLowerCase().trim();

      if (!email) {
        throw new Error("Cannot create an authenticated user without an email.");
      }

      const username = await generateUniqueUsername(data.name ?? email.split("@")[0] ?? "player");

      const created = await prisma.user.create({
        data: {
          email,
          name: getDisplayName(email, data.name),
          username,
          role: "USER",
          image: data.image,
          emailVerified: data.emailVerified
        }
      });

      return toAdapterUser(created);
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? toAdapterUser(user) : null;
    },
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? toAdapterUser(user) : null;
    },
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        },
        include: {
          user: true
        }
      });

      return account?.user ? toAdapterUser(account.user) : null;
    },
    updateUser: async ({ id, ...data }) => {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          email: data.email?.toLowerCase().trim(),
          emailVerified: data.emailVerified,
          name: data.name ?? undefined,
          image: data.image ?? undefined
        }
      });

      return toAdapterUser(updated);
    },
    deleteUser: async (id) =>
      prisma.user.delete({
        where: { id }
      }),
    linkAccount: async (account: AdapterAccount) => {
      await prisma.account.create({
        data: account
      });
    },
    unlinkAccount: async ({ provider, providerAccountId }) => {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId
          }
        }
      });
    },
    createSession: async (session) =>
      prisma.session.create({
        data: session
      }),
    getSessionAndUser: async (sessionToken) => {
      const sessionWithUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
          user: true
        }
      });

      if (!sessionWithUser) {
        return null;
      }

      return {
        session: {
          sessionToken: sessionWithUser.sessionToken,
          userId: sessionWithUser.userId,
          expires: sessionWithUser.expires
        },
        user: toAdapterUser(sessionWithUser.user)
      };
    },
    updateSession: async ({ sessionToken, ...data }) =>
      prisma.session.update({
        where: { sessionToken },
        data
      }),
    deleteSession: async (sessionToken) =>
      prisma.session.delete({
        where: { sessionToken }
      }),
    createVerificationToken: async (token) =>
      prisma.verificationToken.create({
        data: token
      }),
    useVerificationToken: async ({ identifier, token }) => {
      try {
        return await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier,
              token
            }
          }
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return null;
        }

        throw error;
      }
    }
  };
}

const adapter = createPrismaAuthAdapter();

export const authOptions: NextAuthOptions = {
  adapter,
  session: {
    strategy: "database"
  },
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    ...(googleAuthEnabled
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!
          })
        ]
      : []),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const parsed = credentialsSignInSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordMatches = await verifyPassword(parsed.data.password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role ?? "USER";
        session.user.email = user.email;
        session.user.name = user.name ?? user.email;
      }

      return session;
    }
  }
};

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getRequiredSession() {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  return session;
}

export async function registerWithCredentials(input: unknown) {
  const parsed = credentialsRegisterSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Registration failed.");
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true }
  });

  if (existing) {
    throw new Error("An account with that email already exists.");
  }

  const username = await generateUniqueUsername(
    parsed.data.name || parsed.data.email.split("@")[0] || "player"
  );

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      username,
      role: "USER",
      passwordHash
    }
  });
}
