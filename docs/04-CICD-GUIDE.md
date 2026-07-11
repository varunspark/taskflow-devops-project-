# 04 — CI/CD Setup Guide (GitHub Actions)

This guide gets your pipeline actually running: every time you push code, GitHub
automatically tests it, builds Docker images, and pushes them to Docker Hub.

Do this **after** you've successfully run the app locally (guide 02).

---

## Step 1 — Create a GitHub repository

1. Go to https://github.com and log in
2. Click the **+** icon top-right → **New repository**
3. Name it `taskflow-devops-project` (or anything you like)
4. Leave it **Public** (so you can link it on your resume/LinkedIn) or Private, your choice
5. Do **NOT** check "Add a README" (we already have one) — click **Create repository**
6. GitHub will show you a page with commands. Keep that tab open.

## Step 2 — Push this project to GitHub

Back in your terminal, inside the `taskflow-devops-project` folder:

```bash
git init
git add .
git commit -m "Initial commit: TaskFlow full-stack app with DevOps pipeline"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskflow-devops-project.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username (copy the exact URL GitHub
showed you in Step 1 if you're unsure).

If this is your first time pushing from this computer, Git may open a browser window
asking you to log in and authorize — do that, then re-run the `git push` command.

**Refresh your GitHub repository page in the browser** — you should now see all your
files there.

## Step 3 — Create a Docker Hub account (free)

1. Go to https://hub.docker.com and sign up (free tier is enough)
2. Remember your username — you'll need it several times

## Step 4 — Create a Docker Hub access token

We use a token instead of your real password — if it ever leaks, you can revoke just
the token without changing your main password.

1. Log into Docker Hub → click your profile icon (top-right) → **Account Settings**
2. Go to **Security** → **New Access Token**
3. Name it `github-actions-taskflow`, permission: **Read & Write**
4. Click **Generate** → **copy the token immediately** (you won't be able to see it again)

## Step 5 — Add secrets to your GitHub repository

Secrets are encrypted values GitHub stores for you — your workflow file can use them,
but they're never shown in logs.

1. On your GitHub repository page, click **Settings** (top menu of the repo, not your account)
2. In the left sidebar: **Secrets and variables** → **Actions**
3. Click **New repository secret**, add these two, one at a time:

   | Name | Value |
   |---|---|
   | `DOCKERHUB_USERNAME` | your Docker Hub username |
   | `DOCKERHUB_TOKEN` | the access token you copied in Step 4 |

You don't need the `AWS_DEPLOY_ROLE_ARN` secret unless you're also doing the Terraform
AWS deployment — that's covered separately in `terraform/README.md`. Without it, the
`terraform-plan` and `terraform-apply` jobs will simply fail, which is fine — the
`backend-test`, `frontend-test`, and `build-and-push` jobs will still work correctly.

## Step 6 — Watch the pipeline run

1. On your GitHub repo page, click the **Actions** tab
2. You should see a workflow run already in progress (triggered by your push in Step 2)
3. Click into it to watch each job run live — you'll see the exact same kind of output
   you saw in your terminal, but now it's happening automatically on GitHub's servers

**What success looks like:** `backend-test`, `frontend-test`, and `build-and-push`
all show green checkmarks. `terraform-plan` and `terraform-apply` will show red X's
unless you've completed the AWS/Terraform setup — that's expected and fine for now.

## Step 7 — Confirm the images landed on Docker Hub

Go to https://hub.docker.com/repositories and you should see two new repositories:
`taskflow-backend` and `taskflow-frontend`, each with a `latest` tag.

---

## What to do every time you make a code change from now on

```bash
git add .
git commit -m "describe what you changed"
git push
```

That's it — the pipeline runs automatically. This is the actual daily workflow of a
real engineering team, and now it's yours.

## Practice ideas once this works

- Make a small change (e.g. edit some text in `frontend/src/pages/Login.js`), push it,
  and watch the pipeline rebuild and re-push the image automatically
- Deliberately break a test to see the pipeline fail — then fix it and watch it go green
- Read through `.github/workflows/ci-cd.yml` line by line with the comments — every
  line is explained

## Next step

Once this works, go to **[`05-PRACTICE-FROM-SCRATCH.md`](05-PRACTICE-FROM-SCRATCH.md)**
for a checklist you can use to rebuild your understanding of the whole project without
looking anything up — that repetition is what actually makes this stick for interviews.
