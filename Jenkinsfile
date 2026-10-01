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
                      ${BACKEND_IMAGE}

                    trivy image \
                      --severity HIGH,CRITICAL \
                      --format table \
                      --output trivy-reports/frontend-trivy.txt \
                      ${FRONTEND_IMAGE}
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
            echo 'CI/CD Pipeline failed. Check the stage logs.'
        }
    }
}
