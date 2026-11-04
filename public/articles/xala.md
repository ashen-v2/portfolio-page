# Xala

Containerized app on AWS EC2 with CI/CD.

Xala runs as a three-container stack: a Vue 3 SPA behind Nginx, a FastAPI service, and PostgreSQL. It is deployed on a live EC2 instance with Docker Compose, security groups, and Linux server access.

The GitHub Actions pipeline runs pytest, builds and pushes the Docker image to Docker Hub, then redeploys the EC2 instance through SSM Run Command. The workflow uses OIDC federation and a least-privilege IAM role, so the pipeline does not keep static credentials.

Nginx reverse-proxies API traffic. Alembic migrations and Gemini-powered sales analytics ship with the app.

## Stack

| Piece | Role |
| --- | --- |
| Vue 3 | Single-page app |
| FastAPI | API |
| PostgreSQL | Database |
| Docker | Containers |
| GitHub Actions | CI/CD |
| OIDC | Federation without static credentials |
| EC2 | Host |
| SSM | Redeploy |
