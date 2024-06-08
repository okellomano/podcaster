pipeline {
    agent any
    tools {
        jdk 'jdk17'
        nodejs 'node18'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        APP_NAME = "podcaster-app"
        RELEASE = "1.0.0"
        DOCKER_USER = "okellom"
        DOCKER_PASS = 'dockerhub'
        IMAGE_NAME = "${DOCKER_USER}" + "/" + "${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }
    stages {
        stage('Clean Workspcae') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/okellomano/podcaster'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube-Server') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=podcaster \
                    -Dsonar.projectKey=podcaster'''
                }
            }
        }
        stage('Quality Gates') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'SonarQube-Token'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        stage('Trivy FS Scan') {
            steps {
                script {
                    docker.image('aquasec/trivy:latest').inside('--network=jenkins') {
                        sh "trivy fs . > trivyfs.txt"
                    }
                }
                // sh "trivy fs . > trivyfs.txt"
                // sh 'snyk test'
            }
        }
    }
}