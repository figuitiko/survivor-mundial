# Tasks: Add Auth.js Google-First Authentication

## Phase 1: Foundation

- [ ] 1.1 Update `prisma/schema.prisma` with role enum, password hash, and Auth.js adapter models.
- [ ] 1.2 Install `next-auth`, `@auth/prisma-adapter`, and `bcryptjs`; regenerate Prisma client.
- [ ] 1.3 Update `prisma/seed.ts` so seeded users remain valid under the new auth schema.

## Phase 2: Core Auth Implementation

- [ ] 2.1 Replace `lib/auth.ts` mock session logic with Auth.js config, Prisma adapter, callbacks, and helpers.
- [ ] 2.2 Create `auth.ts` and `app/api/auth/[...nextauth]/route.ts` for App Router-compatible handlers.
- [ ] 2.3 Add credentials register/sign-in server actions with Zod validation and password hashing.
- [ ] 2.4 Add helper logic to generate unique usernames and default USER roles for new accounts.

## Phase 3: UI And Route Wiring

- [ ] 3.1 Create `app/sign-in/page.tsx` with Google-first UX and secondary credentials entry.
- [ ] 3.2 Add auth UI components for provider CTA, credentials sign-in, and registration.
- [ ] 3.3 Update `app/(app)/layout.tsx` and `components/app-shell.tsx` to require sessions and expose real user identity/sign-out.
- [ ] 3.4 Update any existing session consumers to use the new Auth.js session shape.

## Phase 4: Verification And Docs

- [ ] 4.1 Update `README.md` with env vars, provider setup, and credentials behavior.
- [ ] 4.2 Run `npm run prisma:generate`, `npm run lint`, `npm run typecheck`, and `npm run build`.
