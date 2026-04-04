# Survivor Mundial

Phase 2 survivor MVP with a real Prisma-backed survivor core plus stat-challenge scaffolding, built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Prisma, and PostgreSQL.

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
- `/picks` matchday survivor pick flow with used-team and history views
- `/challenges` stat challenge flow
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
components/
  app-shell.tsx
  brand-mark.tsx
  empty-state.tsx
  page-header.tsx
  picks/pick-history.tsx
  picks/pick-form.tsx
  picks/used-teams.tsx
  challenges/challenge-join-form.tsx
  profile/profile-form.tsx
  ui/
lib/
  auth.ts
  mock-data.ts
  prisma.ts
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
- `Matchday`
- `Match`
- `Pick`
- `StatChallenge`
- `ChallengeEntry`

The survivor-specific rules now live server-side:

- one pick per user per matchday
- no reusing a team across the tournament
- picks locked before kickoff
- settlement updates pick outcomes and alive/eliminated status
- dashboard and leaderboard derive from persisted Prisma state

## Notes

- Prisma 7 is configured with `prisma.config.ts`, the `prisma-client` generator, and `@prisma/adapter-pg`.
- App routes are protected through a mock session helper in `lib/auth.ts`.
- Survivor pick rules live in `app/(app)/picks/actions.ts` and `lib/survivor-settlement.ts`.
- The challenge flow still uses placeholder app data in `lib/mock-data.ts`.
