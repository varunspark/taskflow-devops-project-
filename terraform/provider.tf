terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }

  # ---- Remote state (recommended, see terraform/README.md to set this up) ----
  # Uncomment once you've created the S3 bucket + DynamoDB table described in the README.
  # Storing state remotely (instead of on your laptop) is what lets a CI/CD pipeline
  # run `terraform apply` safely without you being present.
  #
  # backend "s3" {
  #   bucket         = "taskflow-terraform-state-<your-unique-suffix>"
  #   key            = "taskflow/terraform.tfstate"
  #   region         = "ap-south-1"
  #   dynamodb_table = "taskflow-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}
