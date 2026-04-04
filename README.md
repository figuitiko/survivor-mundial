# Survivor Mundial

Phase 1 MVP shell for a survivor pool plus stat-challenges product built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Prisma, and PostgreSQL.

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
- `/picks` matchday pick flow
- `/challenges` stat challenge flow
- `/leaderboard` standings
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
  picks/pick-form.tsx
  challenges/challenge-join-form.tsx
  profile/profile-form.tsx
  ui/
lib/
  auth.ts
  mock-data.ts
  prisma.ts
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

## Prisma draft schema

The schema currently models:

- `User`
- `Matchday`
- `Match`
- `Pick`
- `StatChallenge`
- `ChallengeEntry`

It is intentionally scoped as a draft for future phases, with enough shape to support survivor picks, stat challenges, and player records.

## Notes

- Prisma 7 is configured with `prisma.config.ts`, the `prisma-client` generator, and `@prisma/adapter-pg`.
- App routes are protected through a mock session helper in `lib/auth.ts`.
- The current UI uses mocked placeholder data in `lib/mock-data.ts`.
- Pick, challenge, and profile flows already validate with Zod and call server actions, so real persistence can be added without replacing the forms.
