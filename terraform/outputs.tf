output "server_public_ip" {
  description = "Public IP of the EC2 instance - visit http://<this-ip> for the frontend"
  value       = aws_instance.taskflow_server.public_ip
}

output "frontend_url" {
  description = "URL to open the app in your browser"
  value       = "http://${aws_instance.taskflow_server.public_ip}"
}

output "backend_api_url" {
  description = "URL of the backend API"
  value       = "http://${aws_instance.taskflow_server.public_ip}:8080/api"
}

output "ssh_command" {
  description = "How to SSH into the server if you need to debug it"
  value       = "ssh -i taskflow-key.pem ec2-user@${aws_instance.taskflow_server.public_ip}"
}
