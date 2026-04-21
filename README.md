# NetTech India Placement – Monorepo

Frontend and backend now live side-by-side:

- `client/` – Vite + React UI (unchanged layout/styling)
- `backend/` – Express + Mongoose API

## Prerequisites
- Node.js 18+
- MongoDB running locally (default URI: `mongodb://127.0.0.1:27017/nettech_placement`)

## Setup
1) Install deps (uses npm workspaces from repo root):
```bash
npm install
```
2) Environment files:
- Copy `backend/.env.example` → `backend/.env` and adjust if needed:
  - `MONGODB_URI` (default local)
  - `JWT_SECRET`
  - `PORT` (default 5000)
  - `CLIENT_ORIGIN` (default http://localhost:5173)
- Copy `client/.env.example` → `client/.env` (default API base http://localhost:5000/api)

3) Run in development (two terminals recommended):
```bash
npm run dev:server   # starts Express API
npm run dev:client   # starts Vite dev server
```

4) Seed the database (optional, uses shared constants/sample data):
```bash
npm run seed
```

## API/Auth defaults
- Admin bootstrap: `admin` / `admin123` (created on first run or during seed)
- Base URL: `http://localhost:5000/api` (configurable via env)

## Project Notes
- Frontend UI remains visually unchanged; only structure/backend wiring was refactored.
- Seed script hydrates records, domains, content, and demo leads.***/
