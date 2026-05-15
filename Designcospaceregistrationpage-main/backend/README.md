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

## Local database

Create a PostgreSQL database named `cospace_db` in pgAdmin4.

Local development uses the `dev` Spring profile by default:

```txt
src/main/resources/application-dev.yml
```

Override local values with environment variables when needed:

```txt
DB_URL=jdbc:postgresql://localhost:5432/cospace_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-local-secret
```

Schema changes are versioned with Flyway:

```txt
src/main/resources/db/migration
```

Use a new migration file for every schema change. Do not rely on Hibernate to silently reshape the database.

## Commands

```bash
mvn spring-boot:run
mvn test
```
