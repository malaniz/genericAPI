var md5  = require('MD5');

exports.signup = function (db, mail) {
  return function (req, res) {
    var usr, users, token;
    console.log(req.body.signup);

    // existe el usuario?
    db.get('users').findOne({ username: req.body.signup.username})
      .success(function(usr) {
        if (usr) {
          res.status(500).json({ err: 'ERR_USR_EXIST'});
          return;
        } else {
          // habria que ver si se puede guardar el token que luego 
          // se usa para auth. Asi cada vez que inica el dispositivo y si se 
          // reinicio el server ... no pierde el login.
          token = mail.sendConfirmateMail(req.body.username);
          req.body.signup.approved = true;
          req.body.signup.password = md5(req.body.signup.password);
          req.body.signup.token    = token;

          db.get('users').insert(req.body.signup, function(err, doc) {
            res.json({ res: 'OP_OK', data: req.body.signup });
          });
        }

      });
  };
};

exports.confirm = function (db) {
  return function (req, res) {
    req.checkParams('token', 'required').notEmpty();
    req.checkParams('token', 'invalid').len(15, 200);
    var errors = req.validationErrors();
    if (errors) {
      res.json({
        err: 'Invalid parameters',
        errors: errors
      }, 500);
      return;
    }
    var users = db.get('users');
    users.update({ token: req.param('token') }, {
      $set: {
        approved: true,
      }
    }, function(err, data) {
      if (err || (data === 0)) {
        res.status(401).json({ err: 'ERR_TOKEN_NOT_EXIST' });
        return;
      }
      res.json({ res: 'OP_OK' });
    });
  };
};

exports.login = function (db, secret, jwt) {
  return function (req, res) {
    if (req.headers.authorization) {
      usr = jwt.decode(req.headers.authorization.replace('bearer ', ''));
    }
    if ('credentials' in req.body) {
      req.body.credentials.password = md5(req.body.credentials.password);
      console.log(JSON.stringify(req.body.credentials));
      db.get('users').findOne(req.body.credentials)
        .then( function (usr) {
          if (usr!== null) {
            var token = jwt.sign(usr, secret, { expiresinminutes: 60 * 5 });
            usr.token = token;
            usr.id = usr._id;
            delete usr.password;
            delete usr.username;
            res.json(usr);
          } else {
            res.status(401).json({ err: 'ERR_LOGIN_INCORRECT' });
          }
        },
        function (err) {
          res.status(401).json({ err: 'ERR_LOGIN_INCORRECT' });
        });
    } else {
      res.status(404).json({ err: 'ERR_NO_CREDENTIALS' });
    }
  };
};

exports.logged  = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(401).json({err: "ERR_NOT LOGGED"});
};
