var domain = 'http://localhost:8080';
var config = {
  development: {
       MAIL: {
         USER: 'x@gmail.com',
         PASS: '!QSW"',
         TRANSPORT: 'SMTP'
       },

       APP: {
         DB_URL: 'localhost/etalonario',
         CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
         PORT: process.env.PORT || 8080,
         TMP_DIR: 'tmp/',
         UPLOAD_DIR: __dirname + '/app/uploads/'
       },

       AUTH: {
        TWITTER: {
          KEY: '',
          SECRET: '',
          CALLBACK: domain + "/auth/twitter/callback"
        },
        FACEBOOK: {
          KEY: '',
          SECRET: '',
          CALLBACK: domain + "/auth/facebook/callback"
        },
        GOOGLE: {
          KEY: '',
          SECRET: '',
          CALLBACK: domain + "/auth/google/callback"
        }
      }
  },
  production: {
     MAIL: {
       USER: '',
       PASS: '',
       TRANSPORT: 'SMTP'
     },

    APP: {
      DB_URL: 'localhost/etalonario',
      CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
      PORT: process.env.PORT || 6666,
      TMP_DIR: 'tmp/',
      UPLOAD_DIR: __dirname + '/app/uploads/'
    },


     AUTH: {
      TWITTER: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/twitter/callback"
      },
      FACEBOOK: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/facebook/callback"
      },
      GOOGLE: {
        KEY: '',
        SECRET: '',
        CALLBACK: domain + "/auth/google/callback"
      }
    }
  }
};

function init(app){
  var mode = app.get('env');
  return config[mode];
}

exports.init = init;
