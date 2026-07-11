# Terraform Setup Guide

This folder provisions **one EC2 server on AWS** that runs the whole app via Docker Compose,
using the images your CI/CD pipeline builds and pushes to Docker Hub.

You do **not** need to touch this folder to practice the app locally — that's what
`docker-compose.yml` in the project root is for. This folder is only for when you
want to practice deploying to real AWS infrastructure.

---

## What gets created

- 1 EC2 instance (t2.micro — free tier eligible)
- 1 Security Group (firewall rules: SSH, port 80, port 8080)
- Everything is tagged so you can find/delete it easily in the AWS Console

## Prerequisites

1. An AWS account (free tier is enough)
2. [Terraform installed](https://developer.hashicorp.com/terraform/install) (v1.5+)
3. AWS CLI installed and configured (`aws configure`) with an IAM user that has
   permission to create EC2 instances and security groups

## Step-by-step: deploy manually from your laptop

```bash
cd terraform

# 1. Initialize Terraform (downloads the AWS provider plugin)
terraform init

# 2. See exactly what Terraform is about to create — read this before saying yes
terraform plan -var="dockerhub_username=YOUR_DOCKERHUB_USERNAME"

# 3. Actually create the resources
terraform apply -var="dockerhub_username=YOUR_DOCKERHUB_USERNAME"
# Type "yes" when prompted

# 4. Terraform will print the frontend_url — open it in your browser.
#    First boot takes 1-2 minutes for Docker to install and containers to start.
```

## Step-by-step: tear it down (IMPORTANT — avoid surprise AWS charges)

```bash
terraform destroy -var="dockerhub_username=YOUR_DOCKERHUB_USERNAME"
# Type "yes" when prompted
```

Always run `terraform destroy` when you're done practicing for the day.

---

## Optional but recommended: Remote state (S3 + DynamoDB)

By default, Terraform saves its state file (`terraform.tfstate`) on your own laptop.
That's fine solo, but it means only you can run `terraform apply`/`destroy` safely —
which is a problem once GitHub Actions needs to run Terraform too.

**One-time setup** (do this once, manually, before enabling the backend block in `provider.tf`):

```bash
# Create an S3 bucket to store the state file (bucket names must be globally unique)
aws s3api create-bucket --bucket taskflow-terraform-state-yourname123 \
  --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1

aws s3api put-bucket-versioning --bucket taskflow-terraform-state-yourname123 \
  --versioning-configuration Status=Enabled

# Create a DynamoDB table Terraform uses to lock the state
# (prevents two people/pipelines running "apply" at the same time and corrupting state)
aws dynamodb create-table \
  --table-name taskflow-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

Then uncomment the `backend "s3" { ... }` block in `provider.tf`, fill in your bucket
name, and run `terraform init` again — Terraform will offer to migrate your existing
local state into S3.

---

## Optional but recommended: GitHub OIDC (so CI/CD never stores AWS keys)

This is the differentiator mentioned in the CI/CD pipeline (`.github/workflows/ci-cd.yml`).
Instead of pasting a permanent AWS access key into GitHub Secrets, we create an IAM role
that GitHub Actions can assume temporarily, using a token GitHub itself issues per run.

**One-time setup, via AWS Console (simplest for a first time):**

1. Go to **IAM → Identity providers → Add provider**
   - Provider type: OpenID Connect
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. Go to **IAM → Roles → Create role**
   - Trusted entity type: Web identity
   - Identity provider: the one you just created
   - Audience: `sts.amazonaws.com`
   - GitHub organization/repo: restrict to `your-github-username/your-repo-name`
   - Attach a policy with EC2 + S3 + DynamoDB permissions (start with `AmazonEC2FullAccess`
     for practice; scope it down later — least privilege is a good talking point in interviews)

3. Copy the Role ARN it gives you (looks like `arn:aws:iam::123456789012:role/github-actions-taskflow`)

4. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `AWS_DEPLOY_ROLE_ARN`
   - Value: the Role ARN from step 3

Now `terraform-plan` and `terraform-apply` jobs in the pipeline can authenticate to AWS
with zero stored long-lived credentials — this is exactly the pattern real engineering
teams use, and it's a great thing to explain in an interview.

---

## Interview talking points this gives you

- Infrastructure as Code (no manual console clicking)
- Remote state + locking (safe for teams / CI to share)
- OIDC federation instead of static credentials (a senior-level security detail)
- Explicit teardown discipline (cost awareness)
