var express    = require('express')
  , http       = require('http')
  , path       = require('path')
  , bodyParser = require('body-parser')
  , app        = express()
  , config     = require('./config').init(app)
  , db         = require('monk')(config.APP.DB_URL)
  , session    = require('express-session')
  , api        = require('./api.js')
  , mail       = require('./mail.js')
  , auth       = require('./auth')
  , passport   = require('passport')
  , jwt        = require('jsonwebtoken')
  , expressJwt = require('express-jwt')
  , secret     = "4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$"
  ;


mail.init(config);

app.use( bodyParser.json({limit: '50mb'})                                  );
app.use( bodyParser.urlencoded({limit: '50mb', extended: true})            );
app.use( session({ secret: secret, resave: true, saveUninitialized: true}) );
app.use( passport.initialize()                                             );
app.use( passport.session()                                                );
app.use( '/api/', expressJwt({secret: secret})                             );
app.use( require('express-validator')()                                    );

//aca habilitamos la url para la app angular
//
//app.use( '/app', express.static(path.join(__dirname, 'app')));

app.post( '/signup'         , auth.signup(db, mail)        );
app.get ( '/confirm/:token' , auth.confirm(db)             );
app.post( '/login'          , auth.login(db, secret, jwt)  );

// parte restringida de la api
app.get ( '/api/data'       , auth.logged, api.data(db)    );
app.post( '/api/otro'       , auth.logged, api.otro(db)    );


app.all('*', function(req, res){ 
  res.status(404).json({ err: 'ROUTE_NOT_FOUND'});
});

http.createServer(app).listen(config.APP.PORT, function() { 
  console.log("\n[*] Server Listening on port %d", config.APP.PORT); 
});

