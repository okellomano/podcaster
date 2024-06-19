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

        TRIVY_IMAGE = 'aquasec/trivy:latest'
        SCAN_PATH = '.'
        RESULT_FILE = 'trivy_fs_scan.txt'
    }
    stages {
        stage('Clean Workspcae') {
            steps {
                cleanWs()
            }
        }
        stage('Test docker') {
            steps {
                script {
                    sh "docker --version"
                }
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
                    sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=podcaster-CI \
                    -Dsonar.projectKey=podcaster-CI'''
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
        stage('Run Trivy FS Scan') {
            steps {
                script {
                    sh '''docker run --rm -v $(pwd):/root ${TRIVY_IMAGE} fs ${SCAN_PATH} > ${RESULT_FILE}'''
                }
            }
        }
        stage('Build and Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image = docker.build "${IMAGE_NAME}"
                    }
                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }
        }
    }
}