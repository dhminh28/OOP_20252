# CoSpace Backend

Java Spring Boot backend for the CoSpace OOP project.

## Modules

- `controller`: REST API endpoints.
- `service`: business contracts.
- `service.impl`: business implementations.
- `repository`: Spring Data JPA database access.
- `entity`: OOP domain entities.
- `dto`: request and response objects.
- `enums`: controlled status/type values.
- `exception`: domain and API exceptions.
- `config`: CORS and application configuration.
- `security`: auth/JWT placeholders for the next phase.

## Local database and Flyway

Create an empty PostgreSQL database named `ITSS_Nhat` in pgAdmin4. Do not
create tables manually. Flyway owns the database schema and applies every
migration in order when the backend starts.

The migration chain is:

```txt
V1__init_schema.sql
V2__seed_demo_data.sql
V3__add_recharge_requests_and_notifications.sql
V4__add_avatar_and_block_status.sql
V5__expand_demo_dataset.sql
```

Local development uses the `dev` Spring profile by default:

```txt
src/main/resources/application-dev.yml
```

When running with Docker Compose, copy `.env.example` to `.env` at the project
root and configure the PostgreSQL server exposed on the host:

```txt
DB_HOST=host.docker.internal
DB_PORT=5432
DB_NAME=ITSS_Nhat
DB_USERNAME=postgres
DB_PASSWORD=your-postgresql-password
FLYWAY_ENABLED=true
JPA_DDL_AUTO=validate
JWT_SECRET=your-local-secret
```

When running Maven directly outside Docker, provide a JDBC URL instead:

```txt
DB_URL=jdbc:postgresql://localhost:5432/ITSS_Nhat
DB_USERNAME=postgres
DB_PASSWORD=your-postgresql-password
FLYWAY_ENABLED=true
```

Schema changes are versioned in:

```txt
src/main/resources/db/migration
```

Never edit a migration that has already been applied to a shared database.
Create the next migration version, such as `V6__description.sql`. Hibernate
uses `ddl-auto=validate`; it validates entity mappings but does not modify the
schema.

## Demo accounts

All seeded accounts use the password `12345678`.

| Account | Email | State |
| --- | --- | --- |
| Administrator | `admin@cospace.vn` | Active admin |
| Standard member | `member@cospace.vn` | Active with normal booking data |
| Premium member | `premium@cospace.vn` | Active with a high wallet balance |
| New member | `newmember@cospace.vn` | Active with an empty wallet |
| Blocked member | `blocked@cospace.vn` | Blocked account |

Migration `V5` expands the demo database to 30 workspaces covering every
workspace type and status. It also adds equipment, bookings, wallet
transactions, recharge requests, and notifications for presentation scenarios.

Verify migration state in pgAdmin4:

```sql
SELECT installed_rank, version, description, success
FROM flyway_schema_history
ORDER BY installed_rank;
```

## Commands

```bash
docker compose up --build
```

Or run only the backend directly:

```bash
mvn spring-boot:run
mvn test
```
