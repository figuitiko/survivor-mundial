# Design: Add Auth.js Google-First Authentication

## Technical Approach

Adopt Auth.js with Prisma-backed sessions and provider accounts, keeping Google primary and credentials optional. Replace the mock session helper with Auth.js wrappers while preserving the app's existing user/game schema.

## Architecture Decisions

### Decision: Use database-backed Auth.js sessions

**Choice**: Prisma adapter + database sessions.
**Alternatives considered**: JWT-only sessions, continuing mock session logic.
**Rationale**: The app already depends on Prisma user records and benefits from server-side session persistence across providers.

### Decision: Keep app-specific User model and extend adapter schema

**Choice**: Add Auth.js adapter models and auth fields onto the existing `User` model.
**Alternatives considered**: Separate auth user table, optional external identity store.
**Rationale**: Existing survivor/challenge data already points at `User`, so extending it is safer than introducing an identity split.

### Decision: Generate usernames for low-friction auth

**Choice**: Auto-generate a unique username for Google and credentials registrations.
**Alternatives considered**: Force username collection at first login.
**Rationale**: The product requirement favors low registration friction while the current schema requires a username.

## Data Flow

Visitor -> `/sign-in`
  -> Google button or credentials form
  -> Auth.js provider / server action
  -> Prisma adapter + user creation helpers
  -> session stored in DB
  -> protected layout reads session
  -> app routes render with real user identity

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | Modify | Add role enum, password hash, auth adapter models. |
| `prisma/seed.ts` | Modify | Seed roles and keep demo accounts compatible with auth schema. |
| `lib/auth.ts` | Modify | Central Auth.js config, helpers, callbacks, and sign-in wrappers. |
| `auth.ts` | Create | Root Auth.js export for App Router conventions. |
| `app/api/auth/[...nextauth]/route.ts` | Create | Auth.js route handlers. |
| `app/sign-in/page.tsx` | Create | Google-first sign-in page. |
| `app/sign-in/actions.ts` | Create | Credentials register/sign-in server actions. |
| `components/auth/*` | Create | Auth form and provider CTA UI. |
| `app/(app)/layout.tsx` | Modify | Enforce session redirect and pass session user into shell. |
| `components/app-shell.tsx` | Modify | Show real user identity and logout affordance. |
| `README.md` | Modify | Document env vars and auth setup. |

## Interfaces / Contracts

```ts
type AppRole = "USER" | "ADMIN";

type AppSessionUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Username generation and password helpers | Typecheck + focused helper logic checks |
| Integration | Credentials register/sign-in actions and redirects | Build-time validation and server-action wiring |
| E2E | Protected route redirect and sign-in flows | Manual follow-up or future Playwright pass |

## Migration / Rollout

Requires a Prisma schema migration plus auth env vars (`AUTH_SECRET`, Google client ID/secret). Credentials auth is available immediately once dependencies and DB schema are updated.

## Open Questions

- [ ] Should admin seeding be explicit for one existing demo user?
