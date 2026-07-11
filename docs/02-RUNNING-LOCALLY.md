# 02 — Running The App Locally

There are two ways to run this project:

- **Option A: Docker Compose** — one command starts everything (databases, backend,
  frontend). Easiest, and it's exactly what real teams do. **Start with this one.**
- **Option B: Manual** — run each piece yourself in separate terminals. More steps,
  but teaches you what Docker Compose is actually doing behind the scenes. Do this
  *after* Option A has worked at least once.

---

## First: get the project files onto your computer

If you downloaded this as a zip file:
1. Find the downloaded `.zip` file (usually in your Downloads folder)
2. Right-click it → "Extract All" (Windows) or double-click it (Mac) → choose where to extract it, e.g. your Desktop
3. You should now have a folder called `taskflow-devops-project`

Open a terminal (see `01-SETUP-GUIDE.md` section 0 if you forgot how) and navigate
into that folder. "Navigate" means using the `cd` (change directory) command:

```bash
cd Desktop/taskflow-devops-project
```

(Adjust the path if you extracted it somewhere else. Tip: you can type `cd ` (with
a space after) and then drag the folder from your file explorer straight into the
terminal window — it will auto-fill the path for you.)

**Confirm you're in the right place:**
```bash
ls
```
(On Windows PowerShell, `dir` also works.) You should see folders like `backend`,
`frontend`, `terraform`, `k8s`, `docs`, and a file called `docker-compose.yml`.

If you see all of that, you're in the right place. Keep this terminal open.

---

## Option A: Run everything with Docker Compose (recommended)

### Step 1 — Make sure Docker Desktop is running

Open the Docker Desktop application and wait until it shows "Docker Desktop is running"
(usually a green icon). If it's not open, the next command will fail with a
connection error.

### Step 2 — Build and start everything

In your terminal, inside the `taskflow-devops-project` folder, run:

```bash
docker compose up --build
```

**What's happening right now**, in plain English:
- Docker is downloading MySQL and MongoDB (first time only — this can take a few minutes)
- Docker is building your backend into a container image (compiling the Java code)
- Docker is building your frontend into a container image (running `npm run build`)
- Docker starts all four containers and connects them together on a private network

You'll see a lot of text scroll by. **This is normal.** The first run takes 3-8 minutes
depending on your internet speed. Every run after that is much faster because Docker
caches most of the work.

### Step 3 — Know when it's ready

Watch the scrolling text for a line from the backend that looks like:
```
taskflow-backend  | Started TaskflowApplication in X.XXX seconds
```
Once you see that, the app is ready.

### Step 4 — Open the app

Open your web browser and go to:
```
http://localhost:3000
```

You should see the TaskFlow login page. Click "Register here", create an account,
and start creating projects and tasks.

### Step 5 — Stop the app

Go back to your terminal and press `Ctrl + C`. This stops the containers but keeps
your data (your MySQL/MongoDB data is saved in a Docker "volume").

To start it again later (much faster this time, no rebuild needed):
```bash
docker compose up
```

### Step 6 — Fully reset everything (wipes all data)

If you want to start completely fresh, including deleting all your registered users
and tasks:
```bash
docker compose down -v
```
The `-v` deletes the volumes (the saved database data). Without `-v`, your data survives.

---

## Option B: Run each piece manually (for learning, do this second)

This teaches you what's actually happening inside those Docker containers. You'll
need **4 separate terminal windows/tabs** open at once.

### Terminal 1 — Start MySQL and MongoDB only (still via Docker, just the databases)

```bash
docker compose up mysql mongo
```
Leave this running. This starts just the two databases, not the app itself.

### Terminal 2 — Run the backend directly with Maven

```bash
cd taskflow-devops-project/backend
mvn spring-boot:run
```

Wait for the same "Started TaskflowApplication" message as before. The backend is
now running on your machine directly (not in a container), talking to the databases
that ARE in containers.

**Test it worked** — open a new terminal (or your browser) and visit:
```
http://localhost:8080/actuator/health
```
You should see `{"status":"UP"}`.

### Terminal 3 — Run the frontend directly with npm

```bash
cd taskflow-devops-project/frontend
npm install
npm start
```

`npm install` downloads all the frontend's dependencies (only needed once, or
whenever `package.json` changes). `npm start` runs a local development server.

This should automatically open **http://localhost:3000** in your browser. If not,
open it manually.

### Terminal 4 — free for running extra commands, checking logs, etc.

---

## How to know it's actually working end-to-end

1. Register a new account on the login page
2. Create a project (e.g. "My First Project")
3. Click into it, add a task
4. Click into the task, add a comment
5. Refresh the page — your comment and task should still be there (proves the
   databases are actually saving data, not just holding it in memory)

If all 5 steps work, your full stack — React → Spring Boot → MySQL + MongoDB — is
working correctly end to end. Congratulations, you've run a real full-stack
application locally.

---

## Next step

Go to **[`03-ARCHITECTURE.md`](03-ARCHITECTURE.md)** to understand *why* the project
is built this way — this is what you'll actually talk about in interviews.
