# TaskFlow — Full-Stack DevOps Portfolio Project

A team task-management app (like a mini Trello/Jira), built specifically to give you
hands-on, resume-worthy DevOps practice — not just "a CRUD app," but a full pipeline
around it: containerization, CI/CD, Infrastructure as Code, and Kubernetes.

**Stack:** Java Spring Boot (backend) · React (frontend) · MySQL (relational data) ·
MongoDB (flexible data) · Docker · GitHub Actions · Terraform · Kubernetes

---

## Start here

You don't need to read everything below right now. Go in this order:

| Step | Guide | What it covers |
|---|---|---|
| 1 | [`docs/01-SETUP-GUIDE.md`](docs/01-SETUP-GUIDE.md) | Installing everything you need on your laptop, from zero |
| 2 | [`docs/02-RUNNING-LOCALLY.md`](docs/02-RUNNING-LOCALLY.md) | Running the whole app on your machine, step by step |
| 3 | [`docs/03-ARCHITECTURE.md`](docs/03-ARCHITECTURE.md) | How the pieces fit together and *why* (interview material) |
| 4 | [`docs/04-CICD-GUIDE.md`](docs/04-CICD-GUIDE.md) | Setting up the GitHub Actions pipeline |
| 5 | [`docs/05-PRACTICE-FROM-SCRATCH.md`](docs/05-PRACTICE-FROM-SCRATCH.md) | A checklist to redo this whole project from memory |
| 6 | [`docs/06-TROUBLESHOOTING.md`](docs/06-TROUBLESHOOTING.md) | Fixes for the errors you'll most likely hit |
| — | [`terraform/README.md`](terraform/README.md) | Deploying to real AWS infrastructure |
| — | [`k8s/README.md`](k8s/README.md) | Deploying to Kubernetes |

If you only do one thing today, do **Step 1 and Step 2** — that gets the app running
on your laptop.

---

## What this project actually demonstrates

This isn't a to-do-list tutorial clone. It's built to show specific, resume-relevant skills:

- **Full-stack development** — a real REST API (Spring Boot) talking to a real
  frontend (React), with JWT authentication.
- **Polyglot persistence** — MySQL for structured, relational data (users, projects,
  tasks) and MongoDB for flexible, high-write data (comments, activity/audit logs).
  This is a genuine architecture decision, not just "using two databases to show off."
- **Containerization done properly** — multi-stage Dockerfiles, non-root users,
  health checks, small final images.
- **CI/CD with a security-conscious pattern** — GitHub Actions pipeline that tests,
  builds, and deploys using **OIDC federation** instead of storing permanent AWS
  keys as secrets (a detail that usually only comes up in senior interviews).
- **Infrastructure as Code** — the entire AWS server is provisioned by Terraform,
  zero manual console clicking.
- **Kubernetes** — deployments with readiness/liveness probes and a zero-downtime
  rolling update strategy.

## Project structure

```
taskflow-devops-project/
├── backend/              Spring Boot API (Java)
├── frontend/              React app
├── docker-compose.yml     Runs the whole stack locally with one command
├── .github/workflows/     CI/CD pipeline (GitHub Actions)
├── terraform/             AWS infrastructure as code
├── k8s/                   Kubernetes manifests
└── docs/                  Step-by-step guides (start here!)
```

## The fastest way to see it running (if you already have Docker)

```bash
git clone <your-repo-url>
cd taskflow-devops-project
docker compose up --build
```

Then open **http://localhost:3000** in your browser.

If any part of that sentence didn't make sense, that's completely fine — go to
[`docs/01-SETUP-GUIDE.md`](docs/01-SETUP-GUIDE.md) and start from the very beginning.
