import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      name: string;
      role: "USER" | "ADMIN";
    };
  }

  interface User {
    role?: "USER" | "ADMIN";
  }
}
