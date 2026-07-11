# 03 — Architecture (Read This Before Any Interview)

Running the project is step one. Understanding *why* it's built this way is what
actually gets you through a technical interview. This doc is your cheat sheet.

## The big picture

```
┌─────────────┐        HTTP (JSON)        ┌──────────────────┐
│   React     │  ───────────────────────▶ │  Spring Boot API  │
│  (browser)  │  ◀─────────────────────── │    (backend)       │
└─────────────┘                           └─────────┬─────────┘
                                                      │
                                    ┌─────────────────┴──────────────────┐
                                    ▼                                    ▼
                            ┌───────────────┐                  ┌────────────────┐
                            │     MySQL      │                  │    MongoDB      │
                            │ Users, Projects,│                 │ Comments,       │
                            │ Tasks           │                 │ Activity Logs   │
                            └───────────────┘                  └────────────────┘
```

## Why two databases? (this is the #1 question you'll get asked)

This project deliberately uses **both** MySQL and MongoDB, and the split is not
arbitrary — it mirrors a real architectural decision:

**MySQL (relational) holds:** `User`, `Project`, `Task`
- These have a fixed, predictable shape that rarely changes
- They have real relationships to each other (a Task belongs to a Project, which
  belongs to a User) — relational databases are built for exactly this
- We care about strict consistency here (you don't want a task pointing to a
  project that doesn't exist)

**MongoDB (document) holds:** `Comment`, `ActivityLog`
- Comments are simple, high-volume, and never need complex joins — just "give me
  all comments for this task, in order"
- The activity log's `details` field is intentionally a flexible map (`Map<String, Object>`)
  because different actions carry different extra data (a status change logs
  `{from, to}`, a comment logs `{commentId}`) — trying to force that into fixed
  relational columns would mean either a messy schema or a lot of unused nullable columns
- Both collections are append-heavy and read-heavy in a simple way — a great fit
  for a document store

**The interview-ready sentence:** *"I used MySQL for the structured, relational core
of the app — users, projects, tasks — where data integrity and relationships matter.
I used MongoDB for comments and activity logs, which are high-volume, schema-flexible,
and don't need relational joins. It's polyglot persistence based on actual data shape,
not just for the sake of using two databases."*

## Authentication flow (JWT)

1. User submits username + password to `POST /api/auth/login`
2. Backend checks the password against the BCrypt hash stored in MySQL
3. If correct, backend generates a signed JWT (JSON Web Token) containing the username
   and an expiry time, and sends it back to the frontend
4. React stores this token in `localStorage`
5. Every future API request, `api.js` automatically attaches it as
   `Authorization: Bearer <token>`
6. `JwtAuthFilter` on the backend checks this header on every request. If valid, the
   request is treated as authenticated. If missing/invalid/expired, the backend
   returns 401 and the frontend automatically logs the user out.

This is called **stateless authentication** — the backend doesn't store sessions in
memory or a database; the token itself carries everything needed to verify identity.
This is exactly why it scales well: any backend replica can validate any token
without needing to share session state with other replicas (relevant when you later
run 2+ backend pods in Kubernetes).

## Backend folder structure — what each layer does

```
backend/src/main/java/com/taskflow/
├── entity/        JPA entities — map directly to MySQL tables
├── document/       MongoDB documents — map to MongoDB collections
├── repository/     Interfaces Spring auto-implements for database queries
├── dto/            Request/response shapes — what the API actually accepts/returns
├── service/         Business logic lives here (not in controllers!)
├── controller/      HTTP endpoints — thin layer, just calls into services
├── security/         JWT creation and validation
└── config/           Spring Security rules, CORS
```

**Why controllers are "thin"**: Controllers only handle HTTP concerns (reading the
request, calling a service, returning a response). All actual logic — validation
rules, what happens when a task's status changes, writing to the activity log — lives
in the `service` layer. This separation is a real, commonly-asked design principle:
it means your business logic isn't tied to HTTP and could be reused (e.g. by a future
CLI tool or scheduled job) without duplicating code.

## Frontend structure

```
frontend/src/
├── api/api.js          One shared Axios instance — attaches the JWT token automatically
├── context/AuthContext.js   Tracks who's logged in, shared across the whole app
├── pages/                Each route/screen: Login, Register, Dashboard, ProjectDetail, TaskDetail
└── components/            Reusable pieces, e.g. ProtectedRoute
```

**Why one shared `api.js`**: Instead of every page writing its own `fetch()` calls
and manually adding the auth header, everything goes through one configured Axios
instance. This means: adding the token happens in exactly one place, and handling
"token expired → log out" also happens in exactly one place (an Axios interceptor).

## How this maps to the DevOps layer

| Concern | Where it lives | What it demonstrates |
|---|---|---|
| Packaging the app | `Dockerfile` (backend & frontend) | Multi-stage builds, non-root users, health checks |
| Running everything together | `docker-compose.yml` | Service orchestration, networking, volumes |
| Automated testing & building | `.github/workflows/ci-cd.yml` | CI/CD, OIDC auth (no stored AWS keys) |
| Provisioning the server | `terraform/*.tf` | Infrastructure as Code |
| Running at scale, self-healing | `k8s/*.yaml` | Readiness/liveness probes, rolling updates |

When you talk about this project in an interview, you're not saying "I made a to-do
app." You're saying: *"I built a full-stack app with a deliberate polyglot persistence
architecture, containerized it properly, automated testing and deployment through
GitHub Actions using OIDC instead of static credentials, provisioned the infrastructure
with Terraform, and can deploy it to Kubernetes with zero-downtime rolling updates."*
That sentence is the whole point of this project.
