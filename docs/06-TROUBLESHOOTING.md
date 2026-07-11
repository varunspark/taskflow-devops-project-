# 06 — Troubleshooting

Real errors you're likely to hit, and exactly what to do about each one.

---

### "Cannot connect to the Docker daemon"
Docker Desktop isn't running. Open the Docker Desktop application, wait for it to
say "Docker Desktop is running", then try your command again.

---

### "Port 3000 is already allocated" / "port is already in use"
Something else on your computer is already using that port.

Find and stop it:
```bash
# Mac/Linux
lsof -i :3000
kill -9 <the PID number shown>

# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <the PID number shown> /F
```
Or simpler: just close whatever other app might be using port 3000 (often another
React app or a previous run that didn't fully stop), then retry.

---

### Backend container keeps restarting / crash-looping

Check its logs:
```bash
docker compose logs backend
```
The most common cause is the backend starting **before** MySQL is ready. Our
`docker-compose.yml` already has a `depends_on: condition: service_healthy` to
prevent this — but if you edited it, make sure that's still there. If you're running
Option B (manual) from `02-RUNNING-LOCALLY.md`, make sure MySQL/Mongo containers
are fully started (check `docker compose logs mysql` for "ready for connections")
before starting the backend.

---

### "Access denied for user 'taskflow_user'" (MySQL)

You likely have old MySQL data from a previous run with different credentials.
Wipe it and start fresh:
```bash
docker compose down -v
docker compose up --build
```
Remember: `-v` deletes saved data, so only do this if you're okay losing your test data.

---

### Frontend loads but API calls fail / blank data everywhere

Open your browser's Developer Tools (F12 or right-click → Inspect) → **Console** tab
and **Network** tab. Look for the failed request and its error.

- **CORS error mentioning "blocked by CORS policy"**: the backend isn't running, or
  isn't reachable at the URL the frontend expects. Confirm `http://localhost:8080/actuator/health`
  works in your browser first.
- **401 Unauthorized on every request**: your login token expired or is invalid.
  Log out and log back in.
- **Network Error / Failed to fetch**: the backend container/process isn't running at all.

---

### `mvn spring-boot:run` fails with a Java version error

Run `java -version` and confirm it says 17 or higher. If you have multiple Java
versions installed, you likely need to set `JAVA_HOME` to point at Java 17
specifically. Search "set JAVA_HOME to Java 17 on [your OS]" for exact steps for
your operating system.

---

### `npm install` fails or hangs

Try clearing npm's cache and retrying:
```bash
npm cache clean --force
npm install
```
If it still fails, delete `node_modules` and `package-lock.json` inside the
`frontend` folder and try again.

---

### GitHub Actions pipeline fails on `terraform-plan` or `terraform-apply`

This is expected if you haven't set up the `AWS_DEPLOY_ROLE_ARN` secret yet — see
`terraform/README.md`. The `backend-test`, `frontend-test`, and `build-and-push` jobs
should still pass independently.

---

### "git push" asks for a password and rejects it

GitHub no longer accepts your account password for `git push` over HTTPS. You need
either:
- A **Personal Access Token** (Settings → Developer settings → Personal access tokens
  on GitHub, use it in place of your password when prompted), or
- SSH keys set up instead (search "generate SSH key for GitHub" for a guide)

---

### Still stuck?

1. Read the exact error message slowly, top to bottom — it usually tells you exactly
   what's wrong, even if it looks intimidating at first
2. Copy the exact error text and search it — DevOps error messages are almost always
   something many other people have already solved
3. Check `docker compose logs <service-name>` for whichever piece is misbehaving
   (`mysql`, `mongo`, `backend`, or `frontend`)
