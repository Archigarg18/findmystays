# Find My PG Stay — Backend (local copy)

This folder contains a standalone Express backend for the project. It mirrors the original backend used by the frontend and expects a MySQL database configured via `DATABASE_URL`.

Quick start (Windows PowerShell):

```powershell
cd backend
npm install
# copy .env.example to .env and edit DATABASE_URL + JWT_SECRET
copy .env.example .env
# generate Prisma client
npx prisma generate
# run migrations (requires MySQL configured and reachable)
npx prisma migrate dev --name init
# Start in dev mode
npm run dev
```

API base path: `/api` (e.g. `/api/auth/login`, `/api/listings`).
