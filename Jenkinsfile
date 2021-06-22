@Library('my-jenkins-shared') _

def modules = [:]
pipeline {
  agent {
    label 'master' // test-1
  }

  environment {
    // NODE_VERSIONS = "10 12 13 14 15 16"
    // error dependency-cruiser@10.0.1: The engine "node" is incompatible with this module. Expected version "^12.20||^14||>=16".
    // error @babel/eslint-parser@7.14.2: The engine "node" is incompatible with this module. Expected version "^10.13.0 || ^12.13.0 || >=14.0.0".0
    NODE_VERSIONS = "12 14 16"
    NODE_VERSION_DEFAULT = "14"
    RUN_SONAR_SCANNER = 'no'
  }

  parameters {
    string(
      defaultValue: '',
      description: 'Node.js version to run tests for',
      name: 'NODE_VERSION',
      trim: true
    )
  }

  stages {
    stage('Run by Node.js Version') {
      when {
        expression { params.NODE_VERSION != '' }
      }
      stages {
        stage('Info') {
          steps {
            script {
              nvm.info()
            }
          }
        }
        stage('Init') {
          steps {
            script {
              // nvm.runSh 'npx yarn i', params.NODE_VERSION
              npm.install([
                cacheKey: "node_v${env.NODE_VERSION}",
                manager:'npx yarn',
                useNvm: true,
                nodeVersion: params.NODE_VERSION
              ])
            }
          }
        }
        stage("Code Analysis") {
          steps {
            script {
              nvm.runSh "npx yarn run ca", params.NODE_VERSION
            }
          }
        }
        stage("Code Sonar") {
          when {
            expression {
              return env.RUN_SONAR_SCANNER &&
                env.RUN_SONAR_SCANNER.toLowerCase() ==~ /(1|y(es)?)/
            }
          }
          steps {
            script {
              if (params.NODE_VERSION == env.NODE_VERSION_DEFAULT) {
                withCredentials([
                  string(credentialsId: 'sonar_server_host', variable: 'SONAR_HOST'),
                  string(credentialsId: 'sonar_server_login', variable: 'SONAR_LOGIN')
                ]) {
                  nvm.runSh "npx yarn run sonar -- -Dsonar.host.url=${SONAR_HOST} -Dsonar.login=${SONAR_LOGIN}", params.NODE_VERSION
                }
              } else {
                echo "skip"
              }
            }
          }
        }
        stage("Code UnitTest") {
          steps {
            script {
              nvm.runSh "npx yarn run test", params.NODE_VERSION
            }
          }
        }
        stage("Code Docs") {
          steps {
            script {
              if (params.NODE_VERSION == env.NODE_VERSION_DEFAULT) {
                nvm.runSh "npx yarn run docs", params.NODE_VERSION
              } else {
                echo "skipped"
              }
            }
          }
        }
        stage("Code Build") {
          steps {
            script {
              nvm.runSh "npx yarn run build", params.NODE_VERSION
            }
          }
        }
      }
    }
    stage("Run All Versions") {
      when {
        expression { params.NODE_VERSION == '' }
      }
      steps {
        script {
          parallel env.NODE_VERSIONS.split(' ').collectEntries {
            ["node-${it}": {
              node {
                stage("Node.js ${it}.x") {
                  build job: "${env.JOB_NAME}", parameters: [
                    string(name: 'NODE_VERSION', value: "${it}"),
                  ], wait: false
                }
              }
            }]
          }
        }
      }
    }
  }
  post {
    // https://www.jenkins.io/doc/pipeline/tour/post/
    // https://plugins.jenkins.io/telegram-notifications/
    always {
      script {
        cleanWs()
      }
    }
    failure {
      script {
        telegram.sendStatusFail('jk_pipeline_report_to_telegram_token','jk_pipeline_report_to_telegram_chatId')
      }
    }
    success {
      script {
        telegram.sendStatusOk('jk_pipeline_report_to_telegram_token','jk_pipeline_report_to_telegram_chatId')
      }
    }
  }
}
