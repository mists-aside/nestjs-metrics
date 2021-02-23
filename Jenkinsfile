@Library('my-jenkins-shared') _

pipeline {
  agent {
    label 'master' // test-1
  }

  environment {
    NVM_DIR = "${HOME}/.nvm"
    NVM_LOAD = ". ~/.bashrc > /dev/null; set -ex; nvm use 12;"
  }

  stages {
    stage('nvm info') {
      steps {
        echo "NVM lies in ${NVM_DIR}"

        sh """
          set -ex;
          . ~/.bashrc;

          node --version;
          npm --version;
          nvm --version;
          """
      }
    }

    // stage('init') {
    //   steps {
    //     script {
    //       sh """
    //         ${NVM_LOAD}
    //         npm install;
    //       """
    //     }
    //   }
    // }

    // stage('test') {
    //   steps {
    //     script {
    //       sh """
    //         ${NVM_LOAD}
    //         npm run test;
    //       """
    //     }
    //   }
    // }

    // stage('pre-release') {
    //   when {
    //     anyOf {
    //       branch 'master';
    //       branch 'develop';
    //     }
    //   }
    //   steps {
    //     script {
    //       env.COMMIT_MESSAGE = GitLastCommitMessage()
    //     }
    //     sh "echo \"Commit Message: ${env.COMMIT_MESSAGE}\""
    //   }
    // }

    // stage('release') {
    //   when {
    //     branch 'master';
    //   }
    //   steps {
    //     script {
    //       node.npmRelease([
    //         gitCredentialsId: '83811fdb-744b-45ab-acdb-54ab3baf50b5',
    //         npmTokenCredentialId: '52e756f6-5625-41fb-bde9-ead983f84629',
    //         preCommand: env.NVM_LOAD
    //       ])
    //     }
    //   }
    // }
  }
  // post {
  //   always {
  //     cleanWs()
  //   }
  //   // // https://www.jenkins.io/doc/pipeline/tour/post/
  //   // // https://plugins.jenkins.io/telegram-notifications/
  //   // failure {
  //   //   script {
  //   //     telegram.sendStatusFail('jk_pipeline_report_to_telegram_token','jk_pipeline_report_to_telegram_chatId')
  //   //   }
  //   // }
  //   // success {
  //   //   script {
  //   //     telegram.sendStatusOk('jk_pipeline_report_to_telegram_token','jk_pipeline_report_to_telegram_chatId')
  //   //   }
  //   // }
  // }
}
