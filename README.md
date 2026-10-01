# Jenkins CI/CD Pipeline with Docker Compose Deployment

## Project Overview

This project demonstrates a complete CI/CD pipeline using Jenkins, Docker, Docker Compose, GitHub, Trivy, Nginx, Node.js, and PostgreSQL.

The pipeline automates application testing, Docker image creation, security scanning, deployment, health verification, image cleanup, and supports rollback using versioned Docker images.

## Architecture

User
  |
  v
Nginx Frontend
  |
  v
Node.js Backend
  |
  v
PostgreSQL Database

The complete application is deployed using Docker Compose.

## Technologies Used

- GitHub
- Jenkins
- Docker
- Docker Compose
- Trivy
- Node.js
- Express.js
- Nginx
- PostgreSQL
- AWS EC2
- Ubuntu 24.04

## CI/CD Workflow

1. Source code is maintained in GitHub.
2. Jenkins checks out the latest source code from the main branch.
3. Environment variables are securely created using Jenkins Credentials.
4. Backend tests are executed inside a Node.js Docker container.
5. Docker images are built for the frontend and backend.
6. Images are tagged using the Jenkins build number for versioning.
7. Trivy scans the Docker images for HIGH and CRITICAL vulnerabilities.
8. Docker Compose deploys the frontend, backend, and PostgreSQL services.
9. Application health checks verify that the deployment is successful.
10. Unused dangling Docker images are cleaned automatically.
11. Trivy reports are archived as Jenkins build artifacts.

## Environment Configuration

Sensitive database credentials are not stored directly in the GitHub repository.

The database password is stored using Jenkins Credentials and is injected into the `.env` file during pipeline execution.

The `.env` file is excluded from Git using `.gitignore`.

## Docker Compose Services

The application contains three services:

### Frontend

- Nginx web server
- Runs on port 80
- Proxies `/api` requests to the backend

### Backend

- Node.js and Express application
- Runs on port 5000
- Provides `/health` endpoint for health verification

### Database

- PostgreSQL 16
- Uses Docker named volume for persistent storage
- Database health is checked using `pg_isready`

## Health Checks

The backend provides the following health endpoint:

`/health`

The frontend accesses the backend through:

`/api/health`

A successful response confirms that the backend service is running.

## Persistent Storage

PostgreSQL data is stored in the Docker named volume:

`postgres-data`

Persistence was verified by:

1. Creating a table and inserting sample data.
2. Removing the Docker Compose containers.
3. Recreating the containers.
4. Querying PostgreSQL again.

The previously inserted data remained available after container recreation, confirming that persistent storage works correctly.

## Security Scanning

Trivy is used to scan both frontend and backend Docker images.

The pipeline scans for:

- HIGH vulnerabilities
- CRITICAL vulnerabilities

Reports generated:

- `backend-trivy.txt`
- `frontend-trivy.txt`

The reports are archived as Jenkins artifacts for review.

## Docker Image Versioning

Docker images are tagged using the Jenkins build number.

Example:

`jenkins-docker-compose-assessment-backend:2`

`jenkins-docker-compose-assessment-backend:3`

`jenkins-docker-compose-assessment-frontend:2`

`jenkins-docker-compose-assessment-frontend:3`

This allows previous application versions to be retained for rollback.

## Rollback

Rollback was demonstrated by deploying Build 3 and then restoring the frontend using the Build 2 Docker image.

After rollback, the previous version of the application was successfully restored.

This demonstrates how versioned Docker images can be used to recover from an unsuccessful deployment.

## Image Cleanup

The Jenkins pipeline runs:

`docker image prune -f`

This removes unused dangling Docker images while retaining version-tagged images required for rollback.

## Deployment Result

The application was successfully deployed on an AWS EC2 instance.

The frontend was accessible through the EC2 public IP and displayed:

- Deployment Successful
- Backend Status: UP

## Jenkins Pipeline Stages

The Jenkins pipeline contains the following stages:

1. Checkout
2. Environment Setup
3. Backend Test
4. Docker Build
5. Trivy Security Scan
6. Deploy
7. Health Check
8. Rollback Information
9. Image Cleanup

## Deliverables

- Jenkinsfile
- Docker Compose configuration
- Backend Dockerfile
- Frontend Dockerfile
- Trivy security scan reports
- Jenkins pipeline execution evidence
- Deployment evidence
- Persistent storage verification
- Rollback demonstration
- CI/CD workflow documentation
