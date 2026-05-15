# CoSpace Project Structure

The project is structured as a full-stack monorepo with separate frontend and backend applications.

```txt
.
├── frontend/                    # React/Vite frontend app
│   ├── src/
│   │   ├── app/                 # App shell and screen routing
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/              # shared UI primitives
│   │   │   ├── common/
│   │   │   ├── workspace/
│   │   │   ├── booking/
│   │   │   ├── dashboard/
│   │   │   └── profile/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # Java Spring Boot backend
│   └── src/main/java/com/cospace/
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── enums/
│       ├── exception/
│       ├── repository/
│       ├── security/
│       ├── service/
│       └── util/
│   └── src/main/resources/db/migration/
├── database/postgresql/         # pgAdmin4/PostgreSQL scripts
├── docs/                        # API, database, and OOP notes
└── scripts/                     # Local helper commands
```

## Next implementation order

1. Implement workspace list API against repositories.
2. Connect frontend workspace service to real API.
3. Implement auth.
4. Implement booking conflict check and wallet payment.
5. Implement admin dashboard aggregation.
