# Legacy Manual SQL

These scripts were used before Flyway became the schema owner.

Do not run them against `ITSS_Nhat` or another Flyway-managed database.
Their changes are represented by versioned migrations under:

```txt
backend/src/main/resources/db/migration
```

All future schema changes must use the next Flyway version, starting with
`V5__...sql`.
