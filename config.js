
const domain = 'http://localhost:7778';
const config = {
  development: {
    MAIL: { USER:'ingnucious@gmail.com', PASS:'!QAZXSW"', TRANSPORT:'SMTP' },
    // habria que setear usuarios por defecto

    APP: {
      DB_URL: 'localhost/xxx01',
      CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
      PORT: process.env.PORT || 7778,
      TMP_DIR: 'tmp/',
      UPLOAD_DIR: __dirname + '/app/uploads/'
    },
    AUTH: {
      TWITTER: {
        KEY: '79B1J37pFygmRI4i53bgJATRg',
        SECRET: '9epB63wMPGNyPSMtTQ9zSvwczK7DTw7Yhfmhx0JrtPfMgpsSTq',
        CALLBACK: domain + "/auth/twitter/callback"
      },
      FACEBOOK: {
        KEY: '384015628417206',
        SECRET: 'd550697ccfbfe7bca4114aa355dd23bc',
        CALLBACK: domain + "/auth/facebook/callback"
      },
      GOOGLE: {
        KEY: '850401798283-ngvfvtnqimai13hhns75gtci0q3lv93f.apps.googleusercontent.com',
        SECRET: 'pdCyzp6JSl2NaZ-JuLJyAFgB',
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
      DB_URL: 'mongodb://heroku_zbr98f42:ehu6q91sv8v5r1gb7j9ld2s5n7@ds041506.mlab.com:41506/heroku_zbr98f42',
      CONFIRM_ACCOUNT_LINK: domain + '/confirm/email',
      PORT: process.env.PORT || 7778,
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

exports.init = (app) => {
  const mode = app.get('env');
  console.log(mode);
  return config[mode];
}
