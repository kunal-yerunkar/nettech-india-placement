Project: NetTech (placement site)

Purpose:
- Backend: Express + MongoDB API serving leads, content, schemas, admin operations, and activity logs.
- Frontend: React + Vite SPA that consumes the backend API.

Key endpoints (base: `/api`):
- `POST /api/auth/login` — returns `{ accessToken }` (JWT, 24h)
- `GET /api/records/:key` — read-only content records
- `GET /api/content/:key` — content pieces
- `GET /api/schemas/:type` — form schemas
- `POST /api/leads/:type` — submit lead (student|partner|inquiry)
- Admin (requires `Authorization: Bearer <token>`):
  - `GET /api/admin/leads/:type`
  - `POST /api/admin/records/:key`
  - `DELETE /api/admin/records/:key/:id`
  - `POST /api/admin/schemas/:type`
  - `GET /api/admin/activity-logs`

Data models (summary):
- `Lead`: { type, id, status, timestamp, payload }
- `Record`: { key, data }
- `Content`: { key, data }
- `FormSchema`: { type, fields }
- `Admin`: { username, password }
- `ActivityLog`: adminId, action, resourceType, resourceId, changes, ip, userAgent, status, timestamp

How to explain this project to an AI for testing:
1. Describe the high-level architecture: "A Node/Express API with MongoDB, and a React SPA frontend built with Vite. The backend exposes endpoints for public content and authenticated admin operations. Auth uses JWT."
2. Provide API surface (list endpoints above) and auth details (login returns `accessToken`, include in `Authorization` header as `Bearer`).
3. Provide sample requests (curl):

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'

# Get content
curl http://localhost:5000/api/records/nt_domains

# Submit lead
curl -X POST http://localhost:5000/api/leads/student -H "Content-Type: application/json" -d '{"fullName":"Jane Doe","email":"jane@example.com"}'
```

4. Supply the `openapi.yaml` file (generated) for the AI to parse endpoints and schemas.

Suggested next tasks for the AI when testing:
- Verify health: `GET /api/health`
- Validate login and token handling
- Exercise public endpoints and admin endpoints (with token)
- Compare responses to current frontend expectations (shapes of `payload` and record objects)

Contact: point the AI to `openapi.yaml` at repo root for machine-readable API definition.
