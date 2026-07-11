# 01 — Setup Guide (Install Everything, From Zero)

This guide assumes you have never set up a development machine for this kind of
project before. Follow it top to bottom. Don't skip steps even if you think you
already have something — just confirm the version.

You'll install 5 things: **Git, Java 17, Maven, Node.js, Docker Desktop**. Then one
code editor: **VS Code**. That's it.

---

## 0. What is a "terminal" and how do I open one?

The terminal (also called "command line", "console", "shell", "PowerShell", or "cmd")
is a text-based way to run commands on your computer, instead of clicking icons.
Every step below tells you an exact command to type and press Enter on.

- **Windows:** Press the Windows key, type `PowerShell`, press Enter.
- **Mac:** Press `Cmd + Space`, type `Terminal`, press Enter.
- **Linux:** Press `Ctrl + Alt + T`.

Keep this terminal window open — you'll use it throughout this whole guide.

---

## 1. Install Git (tracks your code changes, needed for GitHub)

**Windows:** Download from https://git-scm.com/download/win — run the installer,
click "Next" through all the default options, then "Install".

**Mac:** Open Terminal and type:
```bash
git --version
```
If it's not installed, macOS will prompt you to install "Developer Tools" — click Install.

**Linux (Ubuntu/Debian):**
```bash
sudo apt update && sudo apt install -y git
```

**Verify it worked** — type this in your terminal:
```bash
git --version
```
You should see something like `git version 2.43.0`. If you see an error, restart your
terminal and try again before moving on.

---

## 2. Install Java 17 (needed to run the backend)

We need **exactly Java 17** (or newer), not an older version like Java 8.

**Windows / Mac / Linux (easiest way, using Adoptium):**
1. Go to https://adoptium.net
2. It should auto-detect your OS. Choose version **17 (LTS)**.
3. Download and run the installer, clicking "Next" through defaults.

**Verify it worked:**
```bash
java -version
```
You should see `openjdk version "17...`. If you see a different version number
(like 8 or 11), you have an older Java installed too — that's usually fine as long
as `java -version` shows 17 by default. If it doesn't, search "how to set JAVA_HOME
to Java 17 on [your OS]" — this is a very common one-time fix.

---

## 3. Install Maven (builds the Java backend)

**Windows:**
1. Download the "Binary zip archive" from https://maven.apache.org/download.cgi
2. Extract the zip to a folder, e.g. `C:\Program Files\Apache\maven`
3. Add it to your PATH:
   - Search "Environment Variables" in the Windows search bar → "Edit the system environment variables"
   - Click "Environment Variables" → under "System variables" find `Path` → "Edit" → "New"
   - Add `C:\Program Files\Apache\maven\bin`
   - Click OK on everything
4. **Close and reopen your terminal** (important — PATH changes only apply to new terminal windows)

**Mac (using Homebrew — install Homebrew first from https://brew.sh if you don't have it):**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install -y maven
```

**Verify it worked:**
```bash
mvn -version
```
You should see Maven's version number and confirmation it's using Java 17.

---

## 4. Install Node.js (needed to run the frontend)

Node.js lets you run and build the React app.

1. Go to https://nodejs.org
2. Download the **LTS** version (not "Current") — LTS means "long term support", it's the stable one.
3. Run the installer, click "Next" through the defaults.

**Verify it worked:**
```bash
node --version
npm --version
```
You should see something like `v20.x.x` for node and `10.x.x` for npm.

---

## 5. Install Docker Desktop (runs MySQL, MongoDB, and our containers)

This is the most important tool for the DevOps side of this project.

**Windows:**
1. Go to https://www.docker.com/products/docker-desktop
2. Download Docker Desktop for Windows, run the installer
3. It may ask to enable "WSL 2" — click Yes/Enable if prompted, and restart your
   computer if asked to.
4. Open Docker Desktop from the Start menu and wait for it to say "Docker Desktop is running"

**Mac:**
1. Same link as above, download the version matching your chip (Apple Silicon or Intel —
   if you're not sure, click the Apple logo top-left → About This Mac to check)
2. Drag Docker to Applications, open it, wait for it to start

**Linux:**
Follow https://docs.docker.com/engine/install/ for your specific distribution.

**Verify it worked** — with Docker Desktop open and running:
```bash
docker --version
docker compose version
```
Both should print version numbers without errors.

---

## 6. Install VS Code (the code editor you'll use)

1. Go to https://code.visualstudio.com
2. Download and install for your OS
3. Open VS Code once to confirm it launches

Recommended extensions (open VS Code → click the Extensions icon on the left sidebar
→ search and click "Install" for each):
- **Extension Pack for Java** (by Microsoft)
- **ESLint**
- **Docker** (by Microsoft)

---

## 7. Create a free GitHub account (if you don't have one)

Go to https://github.com and sign up. You'll need this in `04-CICD-GUIDE.md`.

---

## Checklist before moving to the next guide

Run every command below in your terminal. Every single one must succeed with no errors:

```bash
git --version
java -version
mvn -version
node --version
npm --version
docker --version
docker compose version
```

If all seven work, go to **[`02-RUNNING-LOCALLY.md`](02-RUNNING-LOCALLY.md)** next.
