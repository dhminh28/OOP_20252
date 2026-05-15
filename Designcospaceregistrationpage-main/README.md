# CoSpace - Co-working Space Management System

CoSpace is a full-stack web application for managing and booking co-working spaces. It was built as an Object-Oriented Programming project with a Java Spring Boot backend, a React frontend, PostgreSQL persistence, Flyway database migrations, JWT authentication, wallet payments, booking conflict validation, and an admin dashboard.

The project is organized as a monorepo so evaluators can run the frontend, backend, and database together with Docker Compose.

## Tech Stack

### Frontend

- React 18
- Vite
- Recharts for dashboard charts
- Lucide React for icons
- Custom CSS styling
- Tailwind CSS note: the project was originally scaffolded from a Tailwind-ready UI template, but unused Tailwind dependencies were removed during cleanup. Re-add Tailwind only if utility-class styling is needed again.

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Cache
- Spring Mail with async notification support
- JJWT for JWT generation and validation
- Springdoc OpenAPI / Swagger UI

### Database and Infrastructure

- PostgreSQL
- Flyway migrations
- Docker and Docker Compose

## Key Features

- JWT authentication with login and registration APIs.
- Stateless Spring Security filter chain.
- Role-ready user model for member and admin accounts.
- Workspace listing with pagination, filtering, and caching.
- Advanced workspace filtering by type, minimum capacity, and maximum price.
- Real-time booking conflict check before payment.
- Transactional wallet deduction and wallet transaction records.
- Booking creation with rollback if payment fails.
- Async booking confirmation email service.
- Admin dashboard with revenue, user, booking, and chart statistics.
- Global exception handler with consistent JSON error responses.
- Request logging interceptor for API response-time monitoring.
- Swagger UI for manual API testing.

## Project Structure

```txt
.
├── backend/                  Spring Boot backend
│   ├── src/main/java/         Java source code
│   ├── src/main/resources/    application.yml and Flyway migrations
│   └── src/test/java/         JUnit and Mockito tests
├── frontend/                 React + Vite frontend
│   ├── src/                  React pages, components, services, hooks, types
│   └── package.json
├── database/postgresql/      Optional pgAdmin helper script
├── docker-compose.yml        PostgreSQL + backend + frontend services
└── package.json              Root helper scripts
```

## Prerequisites

Install:

- Docker
- Docker Compose

Optional for local development outside Docker:

- Java 17
- Maven
- Node.js 18+
- PostgreSQL or pgAdmin4

## Getting Started

From the repository root, run:

```bash
docker compose up --build
```

Docker Compose starts:

- PostgreSQL on `localhost:5432`
- Spring Boot backend on `http://localhost:8080/api`
- React frontend on `http://localhost:5173`

Flyway automatically creates and seeds the database when the backend starts.

To stop the stack:

```bash
docker compose down
```

To remove the PostgreSQL volume and reset all seeded data:

```bash
docker compose down -v
```

Then run `docker compose up --build` again.

## Demo Credentials

The default accounts are created by:

```txt
backend/src/main/resources/db/migration/V2__seed_demo_data.sql
```

| Role | Email | Password |
| --- | --- | --- |
| Member | `member@cospace.vn` | `123456` |
| Admin | `admin@cospace.vn` | `123456` |

The demo member wallet starts with `500000` VND.

## API Documentation

Swagger UI is available after the backend starts:

```txt
http://localhost:8080/api/swagger-ui/index.html
```

Use the login endpoint to obtain a JWT, then click **Authorize** in Swagger UI and paste:

```txt
Bearer <your-token>
```

## Useful Local Commands

Run backend tests:

```bash
cd backend
mvn test
```

Build the frontend:

```bash
npm run build:frontend
```

Run the frontend dev server:

```bash
npm run dev:frontend
```

Run the backend locally:

```bash
npm run dev:backend
```

For local backend execution, provide the environment variables shown in `.env.example` or `backend/.env.example`.

## Core API Areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/workspaces`
- `GET /api/workspaces/{id}`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `GET /api/wallet`
- `POST /api/wallet/recharge`
- `GET /api/admin/dashboard`

## Notes for Evaluation

- The backend is the primary OOP layer: entities model users, members, admins, workspaces, bookings, wallets, and transactions.
- Workspace types use inheritance: `Workspace`, `HotDesk`, `MeetingRoom`, and `PrivateOffice`.
- Booking and wallet operations are transactional to protect business consistency.
- Flyway migrations are the source of truth for schema and demo seed data.
