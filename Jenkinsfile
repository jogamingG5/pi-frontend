pipeline {
    agent any

    environment {
        NODE_HOME = '/usr/bin/node'
        PATH = "${NODE_HOME}:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/jogamingG5/pi-frontend.git',
                    branch: 'main'
            }
        }

        stage('Install') {
            steps {
                dir('streetleague') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Angular') {
            steps {
                dir('streetleague') {
                    sh 'npm run build --prod'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -f Dockerfile.simple -t pi-frontend:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop pi-frontend || true
                    docker rm pi-frontend || true
                    docker run -d --name pi-frontend -p 80:80 --restart unless-stopped pi-frontend:latest
                '''
            }
        }
    }

    post {
        success {
            echo "========================================="
            echo "📧 EMAIL SIMULATION - NOTIFICATION"
            echo "========================================="
            echo "✅ Statut: SUCCESS"
            echo "📁 Projet: ${env.JOB_NAME}"
            echo "🔢 Build: #${env.BUILD_NUMBER}"
            echo "🔗 URL: ${env.BUILD_URL}"
            echo "📧 Destinataire: youssef.zaiene.yz@gmail.com"
            echo "========================================="
        }
        failure {
            echo "========================================="
            echo "📧 EMAIL SIMULATION - NOTIFICATION"
            echo "========================================="
            echo "❌ Statut: FAILED"
            echo "📁 Projet: ${env.JOB_NAME}"
            echo "🔢 Build: #${env.BUILD_NUMBER}"
            echo "🔗 URL: ${env.BUILD_URL}"
            echo "📧 Destinataire: youssef.zaiene.yz@gmail.com"
            echo "========================================="
        }
    }
}
