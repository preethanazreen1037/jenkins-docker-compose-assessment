pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'jenkins-docker-compose-assessment-backend'
        FRONTEND_IMAGE = 'jenkins-docker-compose-assessment-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment Setup') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'assessment-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    sh '''
                        cat > .env <<EOF
PORT=5000
DB_HOST=database
DB_PORT=5432
DB_NAME=assessmentdb
DB_USER=assessmentuser
DB_PASSWORD=${DB_PASSWORD}
EOF
                    '''
                }
            }
        }

        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh '''
                        docker run --rm \
                          -v "$PWD:/app" \
                          -w /app \
                          node:20-alpine \
                          sh -c "npm install && npm test"
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker compose build

                    docker tag ${BACKEND_IMAGE}:latest \
                      ${BACKEND_IMAGE}:${BUILD_NUMBER}

                    docker tag ${FRONTEND_IMAGE}:latest \
                      ${FRONTEND_IMAGE}:${BUILD_NUMBER}

                    echo "Created versioned images:"
                    echo "${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    echo "${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    mkdir -p trivy-reports

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --format table \
                      --output trivy-reports/backend-trivy.txt \
                      ${BACKEND_IMAGE}:${BUILD_NUMBER}

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --format table \
                      --output trivy-reports/frontend-trivy.txt \
                      ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 10
                    curl --fail http://localhost/api/health
                    docker compose ps
                '''
            }
        }

        stage('Rollback Information') {
            steps {
                sh '''
                    echo "Current deployed build: ${BUILD_NUMBER}"
                    echo "Versioned Docker images are retained for rollback."
                    echo "Rollback can be performed by redeploying a previous image tag."
                '''
            }
        }

        stage('Image Cleanup') {
            steps {
                sh '''
                    docker image prune -f
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-reports/*.txt',
                             allowEmptyArchive: true
        }

        success {
            echo 'CI/CD Pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD Pipeline failed. Previous versioned image can be used for rollback.'
        }
    }
}
