# Architecture Decisions

This project should grow by stable modules and contracts, not by adding unrelated screen-specific code every sprint.

## Current Direction

- Monorepo with separate `frontend/` and `backend/`.
- Frontend owns presentation, client state, and API clients.
- Backend owns business rules, persistence, validation, and authorization.
- PostgreSQL schema is versioned through Flyway migrations.
- Java domain entities carry the OOP model used in the course report.

## Backend Boundaries

Keep each business capability behind a service contract:

```txt
AuthService
WorkspaceService
BookingService
WalletService
AdminDashboardService
```

Controllers should stay thin. They should validate request shape, call services, and return DTOs.

Repositories should not leak into controllers.

## Frontend Boundaries

Pages compose features and layout.

Components should stay grouped by domain:

```txt
components/workspace
components/booking
components/profile
components/dashboard
components/common
components/ui
```

API calls stay in `services/`. Pages and components should not call `fetch` directly.

## Database Rule

After Flyway is introduced, every database shape change gets a migration:

```txt
V3__add_booking_payment_status.sql
V4__add_workspace_opening_hours.sql
```

Avoid changing tables manually in pgAdmin4 without recording the same change as a migration.

## Portfolio Standard

Before adding a new feature, define:

1. Domain rule.
2. API contract.
3. Database change if needed.
4. Backend service method.
5. Frontend service call.
6. UI state and error handling.

This keeps the project explainable in interviews.
