# Proposal: Add Auth.js Google-First Authentication

## Intent

Replace the mock session helper with real App Router authentication so protected routes use actual user identity and support low-friction sign-in.

## Scope

### In Scope
- Add Auth.js with Google as the primary sign-in flow.
- Add optional email/password credentials auth with server-side hashing.
- Persist auth users/sessions with Prisma and expose USER/ADMIN roles.

### Out of Scope
- Password reset and email verification flows.
- Admin dashboards or role-based feature gating beyond role persistence.

## Capabilities

### New Capabilities
- `user-authentication`: Sign-in, session resolution, route protection, and role-aware user records.

### Modified Capabilities
- None.

## Approach

Use Auth.js with a Prisma adapter and a custom user-creation path that preserves existing app-specific user fields. Add a dedicated sign-in page with Google-first UX and optional credentials forms.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | Modified | Add auth adapter models, roles, and password storage. |
| `lib/auth.ts` | Modified | Replace mock session helper with Auth.js integration. |
| `app/(app)/layout.tsx` | Modified | Redirect unauthenticated users to sign-in. |
| `app/sign-in/*` | New | Auth UI and actions. |
| `README.md` | Modified | Document auth setup and required env vars. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Adapter schema mismatch | Med | Use Auth.js-compatible Prisma models and regenerate client. |
| Google sign-in cannot populate required user fields | Med | Generate app-safe defaults for username and role. |
| Credentials flow weakens security | Low | Hash passwords server-side and validate with Zod. |

## Rollback Plan

Revert the auth files and schema changes, regenerate Prisma client, and restore the previous mock `lib/auth.ts` flow.

## Dependencies

- `next-auth`
- `@auth/prisma-adapter`
- `bcryptjs`

## Success Criteria

- [ ] Unauthenticated users are redirected from app routes to a real sign-in page.
- [ ] Users can sign in with Google, and optionally with email/password.
- [ ] Authenticated sessions resolve through Prisma-backed Auth.js state with persisted roles.
