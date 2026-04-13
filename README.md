# Survivor Mundial

Phase 4 survivor MVP with a real Prisma-backed survivor core, stat challenges, gamification, and Auth.js authentication, built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Prisma, and PostgreSQL.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui-style local components
- Prisma 7 + PostgreSQL
- React Hook Form + Zod

## Screens shipped

- `/` landing page
- `/dashboard` protected app dashboard
- `/sign-in` Google-first authentication with optional credentials auth
- `/picks` matchday survivor pick flow with used-team and history views
- `/challenges` stat challenge creation and answer flow
- `/leaderboard` survivor standings
- `/profile` player settings

## File structure

```text
app/
  layout.tsx
  page.tsx
  loading.tsx
  error.tsx
  not-found.tsx
  (app)/
    layout.tsx
    loading.tsx
    error.tsx
    dashboard/page.tsx
    picks/page.tsx
    picks/actions.ts
    challenges/page.tsx
    challenges/actions.ts
    leaderboard/page.tsx
    profile/page.tsx
    profile/actions.ts
  api/auth/[...nextauth]/route.ts
  sign-in/page.tsx
components/
  auth/google-sign-in-form.tsx
  auth/credentials-auth-panel.tsx
  app-shell.tsx
  brand-mark.tsx
  empty-state.tsx
  page-header.tsx
  picks/pick-history.tsx
  picks/pick-form.tsx
  picks/used-teams.tsx
  challenges/challenge-join-form.tsx
  challenges/challenge-create-form.tsx
  profile/profile-form.tsx
  ui/
lib/
  auth.ts
  mock-data.ts
  prisma.ts
  challenge-queries.ts
  challenge-settlement.ts
  challenges.ts
  survivor.ts
  survivor-queries.ts
  survivor-settlement.ts
  types.ts
  utils.ts
  validations/
prisma/
  schema.prisma
  seed.ts
```

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Required auth variables:

   ```bash
   DATABASE_URL=
   AUTH_SECRET=
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=
   ```

3. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

## Survivor core

The Prisma schema now models:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Matchday`
- `Match`
- `Pick`
- `Challenge`
- `ChallengeOption`
- `ChallengeAnswer`
- `UserRole`

The survivor-specific rules now live server-side:

- one pick per user per matchday
- no reusing a team across the tournament
- picks locked before kickoff
- settlement updates pick outcomes and alive/eliminated status
- dashboard and leaderboard derive from persisted Prisma state

The stat challenge rules also live server-side:

- challenge creation with typed options
- one answer per challenge per user
- no submissions after lock
- settlement marks the correct option and awards bonus points
- leaderboard totals include `survivorPoints + challengeBonusPoints`

## Authentication

- Auth.js is configured for App Router with a Prisma adapter and database sessions.
- Google Provider is the primary sign-in method.
- Credentials auth is available as a secondary sign-in and registration path.
- New accounts default to the `USER` role; seeded local admin uses `ADMIN`.
- Protected app routes redirect unauthenticated users to `/sign-in`.

## Notes

- Prisma 7 is configured with `prisma.config.ts`, the `prisma-client` generator, and `@prisma/adapter-pg`.
- App routes are protected through Auth.js session resolution in `lib/auth.ts`.
- Survivor pick rules live in `app/(app)/picks/actions.ts` and `lib/survivor-settlement.ts`.
- Stat challenge rules live in `app/(app)/challenges/actions.ts` and `lib/challenge-settlement.ts`.
