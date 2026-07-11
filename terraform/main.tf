# ---------------------------------------------------------------------------
# Finds the latest Amazon Linux 2023 image automatically, so you never have
# to hunt for an AMI ID by hand (they change over time / differ per region).
# ---------------------------------------------------------------------------
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# ---------------------------------------------------------------------------
# Security group: acts as a firewall around our EC2 instance.
# Only opens the exact ports our app needs - nothing else.
# ---------------------------------------------------------------------------
resource "aws_security_group" "taskflow_sg" {
  name        = "${var.project_name}-sg"
  description = "Allow HTTP (frontend), backend API, and SSH access"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  ingress {
    description = "Frontend (React via nginx)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend API (Spring Boot)"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic (needed to pull Docker images, install packages, etc.)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-sg"
    Project = var.project_name
  }
}

# ---------------------------------------------------------------------------
# The actual server. user_data.sh runs automatically on first boot and
# installs Docker + starts our containers - so the moment this resource
# finishes creating, your app is already running.
# ---------------------------------------------------------------------------
resource "aws_instance" "taskflow_server" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.taskflow_sg.id]

  user_data = templatefile("${path.module}/user_data.sh", {
    dockerhub_username = var.dockerhub_username
  })

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name    = "${var.project_name}-server"
    Project = var.project_name
  }
}
