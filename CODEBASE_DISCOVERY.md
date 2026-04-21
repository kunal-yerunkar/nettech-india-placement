# NetTech India Placement - Codebase Discovery & Conventions Guide

**Last Updated:** April 2026  
**Purpose:** Document key patterns, conventions, and practices for AI agents and future developers

---

## 1. Development Setup & Commands

### Prerequisites
- **Node.js 18+**
- **MongoDB** running locally (default URI: `mongodb://127.0.0.1:27017/nettech_placement`)
- **Environment files** required in both backend and client directories

### Monorepo Structure
This is an **npm workspaces** project with two main packages:
- `backend/` — Express + Mongoose API
- `client/` — React + Vite frontend

### Core Commands
```bash
# Development (requires 2 terminals)
npm run dev:server     # Express API on port 5000
npm run dev:client     # Vite dev server on port 5173

# Database
npm run seed           # Full database hydration (wipes and reloads)
npm run create-admin   # Create new admin user
npm run ping-db        # Test MongoDB connection

# Build
npm run build:client   # Production build for frontend
```

### Environment Files (Must Create)
- `backend/.env` — API configuration (MONGODB_URI, JWT_SECRET, PORT, CLIENT_ORIGIN)
- `client/.env` — Frontend API URL (VITE_API_BASE_URL)
- Both have `.env.example` templates

### Default Credentials (Development Only)
- **Admin username:** `admin`
- **Admin password:** `admin123`
- ⚠️ **Production:** Default admin is NOT created; must be manually bootstrapped

---

## 2. Architecture Patterns

### Backend Architecture

#### Entry Point & Initialization (`backend/src/server.js`)
```
1. Load .env first (via dotenv.config())
2. Connect to MongoDB with retry logic
3. Auto-bootstrap data if database is empty
4. Create default admin (dev only; fails in prod if missing)
5. Start Express server
```

**Key Pattern:** Environment variables must be loaded BEFORE importing other modules.

#### Middleware Stack (in order, `backend/src/app.js`)
1. **Helmet** — Security headers (XSS, MIME-type sniffing, CSP)
2. **Trust Proxy** — For accurate IP behind reverse proxy
3. **Rate Limiting** — 100 req/15min general, 5 login attempts/15min
4. **CORS** — Explicit origins list (no wildcards in production)
5. **Body Parsing** — JSON, URL-encoded (50MB limit)
6. **MongoDB Sanitization** — Prevents NoSQL injection
7. **Routes** — `/auth`, `/api`, `/leads`, `/admin`
8. **Error Handler** — Global catch-all for unhandled errors
9. **404 Handler** — Returns JSON error for unknown routes

#### Database Connection Pattern (`backend/src/config/db.js`)
```javascript
// Connection pooling: 10 max sockets
// Timeouts: serverSelection 5s, socket idle 45s
// Retry logic: 5 attempts with exponential backoff
// Event handlers: on 'error' and 'disconnected'
// Production validation: fails if localhost URI detected
```

#### Authentication Pattern
- **Token:** JWT, 24-hour expiration
- **Delivery:** `Authorization: Bearer <token>` header
- **Secret source:** From `process.env.JWT_SECRET` (no hardcoded fallback in production)
- **Validation:** `authenticateToken` middleware on admin routes
- **Logging:** All login attempts (success/failure) logged to ActivityLog

### Frontend Architecture

#### Router Structure (`client/App.jsx`)
```
/                     → Layout (shared header/footer)
  /                   → Home
  /about              → About page
  /domains            → Job domains browser
  /process            → Placement process
  /partners           → Partner companies
  /contact            → Contact form
  /success-stories    → Placed students
  /register           → Student registration
  /test               → Interactive test page

/admin                → Admin login
/admin/dashboard      → Admin control panel
```

#### State Management Strategy
- **Local state:** useState for component-level (forms, modals, etc.)
- **Context API:** ThemeContext only (dark mode toggle)
- **No Redux:** Avoided for this project
- **Global theme:** Stored in localStorage + DOM class `dark`

#### Data Fetching Pattern
- Uses **Axios** with interceptors for JWT injection
- All fetches in `useEffect([])` on component mount
- No centralized error handling (each component catches errors)
- No caching strategy (always fresh fetches)
- Named exports from `client/services/api.js`

---

## 3. Code Style & Conventions

### Naming Conventions
| Type | Pattern | Example |
|------|---------|---------|
| Variables/Functions | camelCase | `handleSubmit`, `formData` |
| Components | PascalCase | `RegistrationPage`, `Navbar` |
| DB Keys | snake_case | `nt_students`, `nt_domains` |
| Files | Match export name | `Navbar.jsx`, `api.js` |
| Constants | UPPER_CASE | `ITEMS_PER_PAGE`, `API_BASE_URL` |

### Module System
- **ES6 modules only** (import/export, no CommonJS)
- **Relative imports** for local files: `import { api } from '../services/api'`
- **Absolute imports** for node_modules: `import express from 'express'`
- **No barrel exports** observed (no `components/index.js` patterns)

### Async Patterns
- Always use **async/await** (no `.then()` chaining)
- Error handling with **try/catch** in async functions
- Express route errors passed to `next(error)` for middleware handling

### File Organization
```
backend/
  src/
    app.js                    # Express app factory
    server.js                 # Entry point
    config/db.js             # MongoDB connection
    middleware/              # Auth, logging, etc.
    models/                  # Mongoose schemas
    routes/                  # Endpoint definitions
  scripts/
    seed.js                  # Database hydration
    seedConstants.js         # Seed data

client/
  services/api.js            # Axios client
  context/ThemeContext.jsx   # Global state
  pages/                     # Page components
  components/                # Reusable UI components
  hooks/usePagination.js     # Custom hooks
  constants.js               # App constants
```

### Comments & Documentation
- **Minimal inline comments** — Code is self-documenting
- **Thematic naming** used for clarity (e.g., "Master Hydration" for seed operations)
- **No JSDoc** observed; developers use function signatures for documentation
- **Configuration files** document purpose at top (e.g., `app.js` lists middleware order)

---

## 4. Database Patterns

### Model Architecture

#### Key-Based Content Storage
Instead of separate collections for each data type, uses **generic Record/Content models**:

```javascript
// Single Record collection stores multiple data types:
Record.find({ key: 'nt_students' })   // All placed students
Record.find({ key: 'nt_domains' })    // All job domains
Record.find({ key: 'nt_reels' })      // All success story reels

// Content for static pages:
Content.find({ key: 'nt_content_process' })      // Process steps
Content.find({ key: 'nt_content_faqs' })         // FAQ items
```

**Advantage:** Flexible, no migrations needed for new content types  
**Trade-off:** Loss of type safety, schema validation at app level only

#### Lead Capture Model
```javascript
Lead: {
  type: 'student' | 'partner' | 'inquiry',    // Enum
  id: String (unique),                         // e.g., "NT-SEED-1001"
  status: String,                              // e.g., "Pending", "Qualified"
  timestamp: String,                           // ISO string or locale string
  payload: Object (Mixed)                      // Form data (flexible structure)
}
```

**Design Pattern:** Polymorphic model using discriminator (type field)

#### Activity Logging Model
```javascript
ActivityLog: {
  adminId: ObjectId (ref: Admin),
  adminUsername: String,
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
  resourceType: 'RECORD' | 'SCHEMA' | 'LEAD' | 'ADMIN' | 'AUTH',
  resourceId: String,                          // Which item
  resourceKey: String,                         // For records: 'nt_students', etc.
  changes: { before: Mixed, after: Mixed },    // What changed
  ipAddress: String,
  userAgent: String,
  status: 'SUCCESS' | 'FAILED',
  errorMessage: String (optional),
  timestamp: Date
}
```

**Purpose:** Audit trail for all admin actions

### Indexing Strategy
```javascript
// Lead indexes
Lead.index({ type: 1, status: 1 })                    // Filter by type + status
Lead.index({ type: 1, 'payload.email': 1 })          // Find by email
Lead.index({ type: 1, 'payload.phone': 1 })          // Find by phone
Lead.index({ 'payload.fullName': 'text', ... })      // Full-text search

// Record indexes
Record.index({ key: 1 })                              // Lookup by key
Record.index({ key: 1, 'data.id': 1 })               // Find specific item by key

// ActivityLog indexes
ActivityLog.index({ adminId: 1, timestamp: -1 })     // User's activities
ActivityLog.index({ action: 1, timestamp: -1 })      // All actions of type
ActivityLog.index({ resourceType: 1, timestamp: -1 }) // All changes to resource type
```

### Connection Pooling Configuration
```javascript
const connectionOptions = {
  maxPoolSize: 10,                    // Max connections
  serverSelectionTimeoutMS: 5000,     // How long to retry connection
  socketTimeoutMS: 45000,             // Close idle sockets
  family: 4,                          // IPv4 only
};
```

**Production Validation:** Fails startup if:
- `MONGODB_URI` contains `localhost` or `127.0.0.1`
- No admin user exists and no bootstrap credentials provided

---

## 5. Frontend Conventions

### Component Structure

#### Functional Components with Hooks
```javascript
const MyComponent = () => {
  // Local state
  const [state, setState] = useState(initialValue);
  
  // Router context
  const navigate = useNavigate();
  const location = useLocation();
  
  // Global context
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Side effects
  useEffect(() => {
    // Fetch data, cleanup listeners, etc.
  }, [dependencies]);
  
  // Memoized computations
  const expensiveValue = useMemo(() => {
    // Complex calculations
  }, [deps]);
  
  return <JSX />;
};
```

#### API Client Pattern (`services/api.js`)
```javascript
// Axios instance with interceptors
const apiClient = axios.create({ baseURL: BASE_URL });
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Named exports for each endpoint
export const api = {
  getStudents: async () => (await axios.get(`${BASE_URL}/records/nt_students`)).data,
  getDomains: async () => (await axios.get(`${BASE_URL}/records/nt_domains`)).data,
  registerStudent: async (data) => {
    try {
      return (await axios.post(`${BASE_URL}/leads/student`, data)).data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Request failed');
    }
  }
};
```

#### Form Pattern (RegistrationPage)
1. **State management:** Single `formData` object for all fields
2. **Schema-driven:** Fetch form schema from backend, render fields dynamically
3. **Validation:** Type-specific (student/partner/inquiry) validation rules
4. **Prefill:** Support route state parameter for pre-population
5. **Error display:** Collect errors in `errors` state object
6. **Submission:** POST to `/api/leads/{type}` endpoint

#### Admin Dashboard Pattern
1. **Tab navigation:** Switch between different resource views
2. **Pagination:** Each tab has its own `usePagination` hook (10 items/page)
3. **Modal workflow:** Edit/create happens in modal overlay
4. **Status management:** Custom status values per resource type (e.g., "INITIAL UPLINK" for pending partners)
5. **Export:** Download data as Excel via XLSX library
6. **Search:** Filter items by search term

### Styling Approach
- **Tailwind CSS** utility classes exclusively (no CSS modules or styled-components)
- **Dark mode:** CSS class on root element + localStorage persistence
- **Icons:** Lucide React for all SVG icons
- **No component library:** No Bootstrap, Material-UI, or similar (build custom components)

### Custom Hooks Pattern
```javascript
export const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginationData = useMemo(() => {
    // Expensive pagination calculations
  }, [items, currentPage, itemsPerPage]);
  
  return {
    ...paginationData,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
};
```

---

## 6. Input Validation

### Backend Validation (`leadRoutes.js`)
Uses **express-validator** middleware:

```javascript
const validateStudentLead = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Required')
    .isLength({ min: 2, max: 100 }).withMessage('2-100 chars'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .matches(/^[0-9\-\+\(\)]{10,15}$/).withMessage('Valid phone required'),
  
  body('interestedDomain')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  
  body('skills')
    .optional()
    .isArray().withMessage('Must be array')
    .custom(arr => arr.every(s => typeof s === 'string' && s.length > 0 && s.length <= 100))
];

// Applied to POST route:
router.post('/:type', validateLeadType, validateStudentLead, handleValidationErrors, (req, res) => {
  // Validation guaranteed to pass
});
```

**Error Response Format:**
```javascript
{
  success: false,
  message: 'Validation failed',
  errors: [
    { field: 'email', message: 'Valid email required' },
    { field: 'phone', message: 'Valid phone required' }
  ]
}
```

### Frontend Validation
- **Approach:** Inline validation logic in components
- **No external library:** Zod, Yup, Joi not used
- **Error collection:** `errors` state object, keyed by field name
- **No schema builder:** Hand-written validation per form

---

## 7. Testing & Quality

### Current State
❌ **No test files found**
- No `.test.js`, `.spec.js`, or `__tests__` directories
- No test runners configured (Jest, Vitest, Mocha absent)
- No CI/CD pipeline documented

### Validation Gaps
- No integration tests for API endpoints
- No component snapshot tests
- No E2E tests for user workflows
- Manual testing only (as evidenced by "missing data" document)

### Recommendations for AI Agents
When working on this codebase:
1. Test API endpoints manually via `curl` or Postman (documented in PROJECT_EXPLAINER.md)
2. Use health check endpoint to verify server startup: `GET /api/health`
3. Validate form submissions match lead type schema
4. Check database directly for ActivityLog entries after admin actions

---

## 8. Common Pitfalls & Pain Points

### Security Issues (Recently Fixed)
✅ **Helmet middleware** added for security headers  
✅ **Rate limiting** added for brute force protection  
✅ **MongoDB sanitization** added for NoSQL injection prevention  
✅ **Global error handler** prevents stack trace leaks in production  
✅ **JWT secret** now fails fast in production if not set  
✅ **Admin bootstrap** only in development; production requires manual setup  

### Known Data Issues
🔧 **Cleaned in seed data:**
- Some students had invalid names ("nan") → renamed to "Recent Candidate"
- All students missing profile images → auto-generated via ui-avatars.com API
- Table headers accidentally seeded as records → removed

### Architecture Limitations
⚠️ **No error boundaries** — Single error breaks entire React app  
⚠️ **No global loading states** — Each page manages its own loading UI  
⚠️ **No cache invalidation** — Always refetches data after mutations  
⚠️ **No server-side pagination** — All items fetched, filtered on client  
⚠️ **Mixed type schemas** — Mongoose Mixed type loses IDE type hints  

### Deployment Challenges
- `.env` files must be manually created (not in git)
- MongoDB URI hardcoded to localhost in development
- Default admin only created in dev; production requires manual setup
- Frontend built separately and deployed to different host (Vercel)
- No Docker in main project (rebuild-scaffold has separate docker-compose)

---

## 9. Uncommon Patterns Requiring Note

### Thematic/Domain-Specific Language
The codebase uses metaphorical naming that may confuse new developers:

| Term | Meaning |
|------|---------|
| "Master Hydration" | Database seed operation (full data load) |
| "Uplink" | Database connection or API call |
| "Nodes" | Admin users or database records |
| "Stale nodes scrubbed" | Old data deleted before reseeding |
| "Architect" | Form schema editor in admin dashboard |

### Key-Based Content Model
Instead of traditional collections per entity type, uses generic **Record/Content** with key-based lookups:
```javascript
// Not:
Student.find() | Partner.find() | Reel.find()

// Instead:
Record.find({ key: 'nt_students' })
Record.find({ key: 'nt_partners' })
Record.find({ key: 'nt_reels' })
```
**Benefit:** No schema migration needed for new content types  
**Cost:** No type safety without app-level validation

### Domain Clustering for Skill Recommendation
Job domains grouped into clusters for profile strength calculation:
```javascript
DOMAIN_CLUSTERS = {
  DATA: [1, 11],                      // Data Science, Finance Analyst
  CYBER_NETWORK: [2, 3, 7],           // Cyber Security, Cloud, Networking
  DEVELOPMENT: [5, 6, 4],             // Full Stack, MERN, Testing
  // ...
}

// Used to recommend skills when user selects domain
// and calculate "profile strength" (0-100 score)
```

### Activity Logging Strategy
Every admin action logged to `ActivityLog` collection:
- Captures IP, user-agent, timestamp, action type
- Tracks "before/after" changes for updates
- Stores all login attempts (success/failure)
- Indexed for efficient audit queries

---

## 10. Quick Reference for AI Agents

### API Endpoints Summary
```bash
# Public (no auth)
GET  /api/health                              # Server status + DB connection
GET  /api/records/{key}                       # Get records by key
GET  /api/content/{key}                       # Get content by key
GET  /api/schemas/{type}                      # Get form schema
POST /api/leads/{type}                        # Submit lead form

# Authentication
POST /api/auth/login                          # Login (returns accessToken)

# Admin (requires: Authorization: Bearer <token>)
GET  /api/admin/leads/{type}                  # Fetch leads by type
POST /api/admin/records/{key}                 # Create/update record
DELETE /api/admin/records/{key}/{id}          # Delete record
POST /api/admin/schemas/{type}                # Update form schema
GET  /api/admin/activity-logs                 # Fetch audit trail
```

### Typical Workflow
```
1. User fills registration form (client/pages/RegistrationPage.jsx)
2. Frontend validates form data (express-validator rules)
3. POST to /api/leads/student with { fullName, email, phone, ... }
4. Backend creates Lead document with status: 'Pending'
5. Admin logs in (POST /api/auth/login) to get JWT token
6. Admin views leads in dashboard (GET /api/admin/leads/student)
7. Admin updates lead status via modal (POST /api/admin/records/leads + manual statusUpdate)
8. All actions logged to ActivityLog collection with adminId, action, changes
9. Admin exports as Excel (XLSX.write())
```

### Environment Variables Reference
```bash
# Backend
MONGODB_URI=mongodb://127.0.0.1:27017/nettech_placement
JWT_SECRET=your-secret-key-here
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development

# Optional Bootstrap
AUTO_BOOTSTRAP=true
RESET_DB=false
RESET_CONFIRM=
BOOTSTRAP_ADMIN_USER=admin
BOOTSTRAP_ADMIN_PASS=admin123

# Client
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 11. Resources

- **API Documentation:** See `openapi.yaml` (machine-readable endpoint spec)
- **Project Architecture:** See `PROJECT_EXPLAINER.md`
- **Deployment Guide:** See `DEPLOYMENT_STEPS.md`
- **Security Improvements:** See `SECURITY_IMPROVEMENTS_SUMMARY.md`
- **Production Readiness:** See `PRODUCTION_READINESS.md`
- **Data Seed:** See `backend/scripts/seedConstants.js` (all sample data)

---

**Document Version:** 1.0  
**Last Reviewed:** April 2026  
**Next Review:** After major architecture changes
