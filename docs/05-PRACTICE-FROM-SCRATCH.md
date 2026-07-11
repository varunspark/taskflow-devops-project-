# 05 — Practice From Scratch (Do This Repeatedly)

The goal isn't to run this project once. The goal is to be able to explain and rebuild
every piece of it without looking things up, because that's what an interview actually
tests. Use this checklist every few days until you can tick everything off from memory.

Don't rush to 100% on your first pass — come back to this file repeatedly.

---

## Level 1 — Run it (should take < 10 minutes once comfortable)

- [ ] I can start the whole app with one Docker command without looking at the guide
- [ ] I can register a user, create a project, add a task, and add a comment
- [ ] I can explain what `docker compose down -v` does differently from `docker compose down`
- [ ] I can find and read the backend logs (`docker compose logs backend`)
- [ ] I can find and read the frontend logs (`docker compose logs frontend`)

## Level 2 — Explain the architecture out loud (say it, don't just think it)

- [ ] I can explain why this project uses MySQL AND MongoDB, in one or two sentences,
      without reading `03-ARCHITECTURE.md`
- [ ] I can draw the request flow from browser → React → Spring Boot → database on paper
- [ ] I can explain what a JWT is and why we don't store sessions on the server
- [ ] I can explain the difference between an `entity` (JPA) and a `document` (MongoDB)
      in this codebase, and point to one real example of each
- [ ] I can explain why controllers are "thin" and logic lives in the service layer

## Level 3 — Modify it (the real test of understanding)

Try each of these without asking an AI for the exact code first — struggle with it,
then check your work:

- [ ] Add a new field to `Task` (e.g. `estimatedHours`, a number) — update the entity,
      the DTO, and the React form. Restart and confirm it saves and displays correctly.
- [ ] Add a new activity log action — e.g. log `"TASK_DELETED"` when a task is deleted
- [ ] Add a "delete comment" button and matching backend endpoint
- [ ] Change the JWT expiry time from 24 hours to 1 hour and observe what happens when
      it expires while you're using the app

## Level 4 — Explain the DevOps pipeline out loud

- [ ] I can explain, in order, every stage of the CI/CD pipeline without opening the yml file
- [ ] I can explain what OIDC is and why it's better than storing an AWS access key as
      a GitHub secret
- [ ] I can explain what a multi-stage Dockerfile is and why the final image doesn't
      contain Maven/Node
- [ ] I can explain the difference between a `readinessProbe` and a `livenessProbe`
- [ ] I can explain what `maxUnavailable: 0` does during a Kubernetes rollout

## Level 5 — Deploy it for real

- [ ] I've pushed this to my own GitHub repo and watched the Actions pipeline go green
- [ ] I've deployed it to AWS with Terraform and opened it in a browser at a real public IP
- [ ] I've run `terraform destroy` afterward (don't leave it running and get charged)
- [ ] I've deployed it to a local Kubernetes cluster (Minikube) and used
      `kubectl rollout restart` to simulate a deploy

## Level 6 — The interview pitch

Practice saying this out loud, in your own words, until it's natural (not memorized
word-for-word — understood):

> "I built TaskFlow, a full-stack task management app, specifically to practice the
> full DevOps delivery pipeline. The backend is Spring Boot with a deliberate
> polyglot persistence design — MySQL for the relational core, MongoDB for
> high-volume flexible data like comments and audit logs. I containerized both
> services with multi-stage Dockerfiles, wired up a GitHub Actions pipeline that
> tests, builds, and deploys using OIDC instead of stored AWS credentials, provisioned
> the infrastructure with Terraform, and can deploy the same app to Kubernetes with
> zero-downtime rolling updates using readiness and liveness probes."

If you can say a version of that comfortably and then answer a follow-up question
about any single piece of it, this project has done its job.

---

## When you're ready for more

Once all of the above feels comfortable, go back to the original project ideas list
and consider adding **one** more differentiator on top of this project rather than
starting something new from scratch:
- A chaos engineering experiment: kill the backend pod in Kubernetes mid-use and
  document what happened and what you'd fix
- A container image scan (Trivy) added as a step in the CI/CD pipeline
- Prometheus + Grafana monitoring on top of the Kubernetes deployment

Depth on this one project will serve you better than a second shallow one.
