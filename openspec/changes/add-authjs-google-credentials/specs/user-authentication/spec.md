# User Authentication Specification

## Purpose

Define sign-in, session, and protected-route behavior for Survivor Mundial.

## Requirements

### Requirement: Google-first sign-in

The system MUST present Google as the primary sign-in method and SHALL allow a user to create or resume an account through the Google provider.

#### Scenario: New user continues with Google

- GIVEN a visitor is on the sign-in page without a session
- WHEN they choose Continue with Google and complete provider auth
- THEN the system creates or resumes a local user record
- AND redirects them into the protected app

#### Scenario: Existing user returns with Google

- GIVEN a user already has a linked Google account
- WHEN they authenticate with Google
- THEN the system resumes their session
- AND preserves their existing role and gameplay data

### Requirement: Optional credentials authentication

The system MAY allow sign-in and registration with email and password, but SHALL keep credentials as a secondary flow behind the Google-first CTA.

#### Scenario: User signs in with valid credentials

- GIVEN a user account exists with a stored password hash
- WHEN they submit a valid email and password
- THEN the system signs them in
- AND redirects them into the app

#### Scenario: New user registers with credentials

- GIVEN a visitor does not have an account
- WHEN they submit valid registration data
- THEN the system stores a hashed password server-side
- AND signs them in or routes them into an authenticated session

#### Scenario: Invalid credentials are rejected

- GIVEN a visitor submits an unknown email or incorrect password
- WHEN the credentials request is processed
- THEN the system denies sign-in
- AND returns a user-facing authentication error

### Requirement: Protected app routes

The system MUST require an authenticated session for routes inside the protected app group.

#### Scenario: Unauthenticated visitor opens app route

- GIVEN no active session exists
- WHEN the visitor requests `/dashboard` or another protected app route
- THEN the system redirects them to the sign-in page

#### Scenario: Authenticated user opens app route

- GIVEN an active session exists
- WHEN the user requests a protected route
- THEN the system renders the route with the current session user

### Requirement: Role-aware user records

The system MUST persist a role for each authenticated user and SHALL default newly created accounts to the USER role.

#### Scenario: New account is created

- GIVEN a new user is created by Google or credentials auth
- WHEN the user record is persisted
- THEN the role is set to USER by default

#### Scenario: Existing role is preserved

- GIVEN a user already has an ADMIN or USER role
- WHEN they authenticate again
- THEN the system keeps the existing role unchanged
