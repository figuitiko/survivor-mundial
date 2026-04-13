# AGENTS.md

Guidance for coding and review agents working in `/Users/frank/Workspace/next-js/survivor-mundial`.

## Project Focus

- Next.js App Router application
- TypeScript-first
- Tailwind CSS + shadcn-style UI primitives
- Prisma 7 + PostgreSQL
- Server Components by default

## Working Style

- Deliver working code, not just plans.
- Make reasonable assumptions and complete the task unless truly blocked.
- Keep components small and focused.
- Prefer server-side enforcement for business rules.
- Preserve existing visual language unless the task explicitly asks for redesign.

## Code Rules

- Use Server Components by default; add `"use client"` only when necessary.
- Keep validation server-side with Zod for forms and mutations.
- Do not trust client state for survivor, challenge, or leaderboard logic.
- Use transactions when updating multiple related Prisma records.
- Keep types strict; avoid `any` and unnecessary casts.
- Reuse existing helpers before adding new abstractions.
- Add loading, error, and empty states for user-facing surfaces.

## Prisma And Data

- Keep derived tournament rules server-side.
- Badge awarding must remain idempotent.
- Stat recalculation must be safe to rerun.
- Prefer query helpers in `lib/` over scattering Prisma logic across pages.
- When changing schema, keep seed data aligned.

## UI And UX

- Avoid generic SaaS styling for marketing pages.
- Keep contrast strong, especially on light surfaces and muted panels.
- Use purposeful typography, spacing, and hierarchy.
- Prefer subtle meaningful motion over decorative effects.
- Ensure layouts work on mobile and desktop.

## Review Priorities

When reviewing changes, prioritize:

1. correctness and regressions
2. server-side rule enforcement
3. type safety
4. accessibility and contrast
5. consistency with existing project patterns

## Verification

Before claiming completion, run the relevant checks when possible:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

If Prisma-related files changed, also run:

- `npm run prisma:generate`

