# Manga Translate Helper Platform

This repo now contains a monorepo layout for the Manga Translate Helper platform, including a Next.js admin UI, NestJS API, Prisma schema, and local Docker Compose setup.

## Monorepo layout

```
.
├── apps/
│   ├── api/        # NestJS API + Prisma
│   └── web/        # Next.js admin UI
├── packages/
│   └── shared/     # Shared types/zod schemas
├── infra/          # Docker Compose + env samples
└── README.md
```

## Development (Docker Compose)

```bash
cd infra
# from repo root
# docker compose -f infra/docker-compose.yml up --build
```

Services:
- API: http://localhost:4000
- Swagger: http://localhost:4000/api/docs
- Web: http://localhost:3000
- MinIO: http://localhost:9001
  - `minio-init` is an init container that exits after creating the `mth` bucket.

## Prisma

Schema: `apps/api/prisma/schema.prisma`

Migrations:
```bash
cd apps/api
npm install
npx prisma migrate dev
npx prisma generate
```

Seed:
```bash
npm run seed
```

## Editor integration endpoints (v1)

- Upload page image: `POST /api/v1/pages/upload-url`
- Create/load project: `POST /api/v1/projects`, `GET /api/v1/projects?chapterId=...`
- Save/load entries: `POST /api/v1/entries`, `GET /api/v1/entries?projectId=...&pageId=...`

See the API modules for DTOs and response shapes.
