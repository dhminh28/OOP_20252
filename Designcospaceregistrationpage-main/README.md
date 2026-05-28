# CoSpace - Co-working Space Management System

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen)
![React](https://img.shields.io/badge/React-18-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

CoSpace is a full-stack co-working space management and booking platform built for an Object-Oriented Programming project. The system includes member authentication, workspace browsing, booking conflict validation, wallet-based payments, cancellation flow, admin management screens, PostgreSQL persistence, Flyway migrations, Swagger API documentation, Docker Compose, and CI automation.

The backend is designed around Java OOP principles and layered Spring Boot architecture. The frontend is a React + Vite application that consumes real backend APIs instead of static mock data.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [API Documentation](#api-documentation)
- [Useful Commands](#useful-commands)
- [Testing and CI](#testing-and-ci)

## Features

### Member Features

- Register and login with JWT authentication.
- Browse workspace list with pagination and filtering.
- Filter workspaces by type, minimum capacity, and maximum price.
- View workspace details before booking.
- Create bookings with server-side conflict validation.
- Pay for bookings using an internal wallet balance.
- Recharge wallet balance.
- View personal booking history.
- Cancel bookings and save cancellation reason.
- View profile and wallet information separately from booking history.

### Admin Features

- Admin-only dashboard protected by role-based access control.
- View revenue, booking, member, and occupancy metrics.
- View revenue chart and booking status chart.
- Manage workspaces: create, update, delete, and list records from PostgreSQL.
- View all bookings across members.
- View all registered users.
- View operational reports.
- View runtime/system settings panel.

### Backend Features

- Stateless Spring Security with JWT.
- BCrypt password hashing.
- Global exception handling with consistent JSON responses.
- Transactional booking and wallet payment flow.
- Booking conflict detection before wallet deduction.
- Wallet transaction records for recharge and payment.
- Spring Cache for public workspace queries.
- Async email notification service for successful bookings.
- Request logging interceptor with response time tracking.
- Swagger UI for manual API testing.

## Tech Stack

### Frontend

- React 18
- Vite
- Recharts
- Lucide React
- TypeScript
- Custom CSS-in-TS styling

### Backend

- Java 17
- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- Spring Cache
- Spring Mail
- JJWT
- Springdoc OpenAPI

### Database and DevOps

- PostgreSQL 16
- Flyway migrations
- Docker
- Docker Compose
- GitHub Actions CI

### Testing

- JUnit 5
- Mockito
- Spring Boot Test

## Architecture

CoSpace follows a layered monorepo architecture:

```txt
Frontend React
    -> API service layer
    -> Spring Boot REST controllers
    -> Service layer business logic
    -> Spring Data JPA repositories
    -> PostgreSQL database
```

Backend package responsibilities:

- `controller`: REST API endpoints.
- `service`: Business contracts.
- `service.impl`: Business implementation and transactions.
- `repository`: Spring Data JPA persistence.
- `entity`: OOP domain model.
- `dto.request`: Request DTOs.
- `dto.response`: Response DTOs.
- `security`: JWT provider and authentication filter.
- `exception`: Custom exceptions and global handler.
- `config`: Security, CORS, OpenAPI, async, caching, and web config.

OOP design highlights:

- `User` is the base class for `Member` and `Admin`.
- `Workspace` is the base class for `HotDesk`, `MeetingRoom`, and `PrivateOffice`.
- Business behavior such as workspace price calculation is encapsulated in domain classes.
- Booking, wallet, workspace, and admin logic are separated into dedicated services.

## Project Structure

```txt
.
|-- backend/
|   |-- src/main/java/com/cospace/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- entity/
|   |   |-- enums/
|   |   |-- exception/
|   |   |-- repository/
|   |   |-- security/
|   |   |-- service/
|   |   `-- CospaceApplication.java
|   |-- src/main/resources/
|   |   |-- application.yml
|   |   `-- db/migration/
|   `-- src/test/java/
|
|-- frontend/
|   |-- src/
|   |   |-- app/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- types/
|   |   `-- utils/
|   `-- package.json
|
|-- .github/workflows/ci.yml
|-- docker-compose.yml
|-- package.json
`-- README.md
```

## Database Design

Flyway migrations are stored in:

```txt
backend/src/main/resources/db/migration/
```

Main database areas:

- Auth: `users`
- Workspace: `workspaces`, `workspace_equipment`
- Booking: `bookings`
- Wallet: `wallets`, `wallet_transactions`
- Admin dashboard: aggregates from users, bookings, workspaces, and wallet transactions

Important relationships:

- One member has one wallet.
- One member can have many bookings.
- One workspace can have many bookings.
- One wallet can have many wallet transactions.
- Workspace types are modeled through Java inheritance.

## Getting Started

### Prerequisites

Install:

- Docker
- Docker Compose

Optional for local development:

- Java 17
- Maven
- Node.js 20+
- PostgreSQL or pgAdmin4

### Run With Docker Compose

From the repository root:

```bash
docker compose up --build
```

Services:

```txt
Frontend:  http://localhost:5173
Backend:   http://localhost:8080/api
Swagger:   http://localhost:8080/api/swagger-ui/index.html
Postgres:  localhost:5432
Database:  cospace_db
User:      postgres
Password:  postgres
```

Stop services:

```bash
docker compose down
```

Reset database volume:

```bash
docker compose down -v
docker compose up --build
```

## Demo Accounts

These accounts are seeded by Flyway migration `V2__seed_demo_data.sql`.

| Role | Email | Password |
| --- | --- | --- |
| Member | `member@cospace.vn` | `123456` |
| Admin | `admin@cospace.vn` | `123456` |

The demo member starts with `500000` VND wallet balance.

## API Documentation

Swagger UI:

```txt
http://localhost:8080/api/swagger-ui/index.html
```

Use `POST /api/auth/login` to get a JWT, then authorize requests with:

```txt
Bearer <token>
```

Core API groups:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/workspaces`
- `POST /api/workspaces`
- `PUT /api/workspaces/{id}`
- `DELETE /api/workspaces/{id}`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `PATCH /api/bookings/{id}/cancel`
- `GET /api/wallet`
- `POST /api/wallet/recharge`
- `GET /api/admin/dashboard`
- `GET /api/admin/bookings`
- `GET /api/admin/users`

## Useful Commands

Run backend tests:

```bash
cd backend
mvn test
```

Build frontend:

```bash
npm run build:frontend
```

Run frontend dev server:

```bash
npm run dev:frontend
```

Run backend locally:

```bash
npm run dev:backend
```

## Testing and CI

The project includes JUnit and Mockito tests for:

- Booking conflict validation.
- Booking cancellation.
- Wallet payment and insufficient balance cases.
- Price calculation.
- Admin dashboard aggregation.

GitHub Actions workflow:

```txt
.github/workflows/ci.yml
```

CI runs:

- Maven backend tests.
- Frontend dependency install and Vite build.
- Docker Compose build validation.

## Notes for Evaluators

- This project was built as a solo OOP-focused full-stack application.
- The Java backend is the primary OOP layer.
- PostgreSQL and Flyway are the source of truth for schema and seed data.
- Booking and wallet operations are transactional to protect business consistency.
- Admin and workspace write operations are protected by role-based access control.
