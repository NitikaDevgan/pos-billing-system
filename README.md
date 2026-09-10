# Café POS Billing System

A tablet-oriented café POS foundation. It provides a TypeScript React/Vite frontend and a TypeScript Express API with PostgreSQL and Prisma. Business workflows are intentionally not implemented yet.

## Architecture

```text
.
├── frontend/                         # React, Vite, React Router, Axios
│   ├── public/
│   ├── src/
│   │   ├── app/                      # Router and future state entry point
│   │   ├── assets/ components/ features/ layouts/ routes/
│   │   ├── services/ hooks/ utils/ constants/ context/
│   │   ├── styles/                   # Central theme tokens and global CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                          # Express, PostgreSQL, Prisma, Zod
│   ├── prisma/                       # Schema, migrations, seed entry point
│   ├── src/
│   │   ├── config/ middleware/ shared/ utils/
│   │   ├── modules/                  # Feature-local routes/controller/service/repository
│   │   │   ├── health/
│   │   │   ├── categories/
│   │   │   └── products/
│   │   ├── routes.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

The backend feature flow is `Route → Controller → Service → Repository → Prisma → PostgreSQL`. Controllers handle HTTP only; services coordinate business rules; repositories contain database queries.

## Prerequisites

- Node.js 20.19+ (Node.js 22 LTS recommended)
- npm 10+
- PostgreSQL 14+ with a `cafe_pos` database

## Environment configuration

Copy each example before starting the related app.

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

Set `backend/.env` with your database password:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cafe_pos
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=
```

The frontend uses `VITE_API_BASE_URL=http://localhost:5000/api/v1`. Its health route deliberately remains at `/api/health`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Useful commands: `npm run build` and `npm run preview`.

## Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

Useful commands: `npm run build`, `npm start`, and `npm run prisma:studio`.

## PostgreSQL and Prisma

Create the `cafe_pos` database in PostgreSQL, configure `DATABASE_URL`, then run:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
```

The initial schema contains only `Category` and `Product`; product prices use PostgreSQL decimal money storage.

## API

- `GET /api/health` — server health check
- `GET /api/v1/categories` — category list
- `GET /api/v1/products` — product list

The frontend API client reads `VITE_API_BASE_URL`, so future frontend features should call the backend through `src/services/apiClient.ts`.
