variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1" # Mumbai - closest region if you're in India
}

variable "instance_type" {
  description = "EC2 instance size. t2.micro / t3.micro is AWS free-tier eligible."
  type        = string
  default     = "t2.micro"
}

variable "project_name" {
  description = "Used to name and tag every resource, so it's obvious what belongs to this project"
  type        = string
  default     = "taskflow"
}

variable "ssh_allowed_cidr" {
  description = "Which IPs are allowed to SSH into the server. CHANGE THIS to your own IP for security (e.g. 103.10.20.30/32). 0.0.0.0/0 means 'anyone' - fine for a short-lived practice project, risky long-term."
  type        = string
  default     = "0.0.0.0/0"
}

variable "dockerhub_username" {
  description = "Your Docker Hub username, used to pull the images this project builds"
  type        = string
}
