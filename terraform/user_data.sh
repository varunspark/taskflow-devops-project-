#!/bin/bash
# This script runs automatically the FIRST time the EC2 instance boots.
# It installs Docker + Docker Compose, then pulls and starts our app containers.
set -e

# Install Docker
yum update -y
yum install -y docker
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

# Install Docker Compose (plugin form: `docker compose`, not the old `docker-compose`)
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Write a minimal docker-compose file that just runs the pre-built images
# from Docker Hub (built and pushed by our GitHub Actions pipeline).
mkdir -p /opt/taskflow
cat > /opt/taskflow/docker-compose.yml << 'EOF'
version: "3.9"
services:
  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: taskflow
      MYSQL_USER: taskflow_user
      MYSQL_PASSWORD: taskflow_pass
    volumes:
      - mysql_data:/var/lib/mysql

  mongo:
    image: mongo:7.0
    restart: unless-stopped
    volumes:
      - mongo_data:/data/db

  backend:
    image: ${dockerhub_username}/taskflow-backend:latest
    restart: unless-stopped
    environment:
      MYSQL_HOST: mysql
      MONGO_HOST: mongo
      MYSQL_DATABASE: taskflow
      MYSQL_USER: taskflow_user
      MYSQL_PASSWORD: taskflow_pass
      MONGO_DATABASE: taskflow_logs
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - mongo

  frontend:
    image: ${dockerhub_username}/taskflow-frontend:latest
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
  mongo_data:
EOF

cd /opt/taskflow
docker compose up -d
