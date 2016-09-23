var express    = require('express'),
    cors       = require('cors'),
    http       = require('http'),
    bodyParser = require('body-parser'),
    app        = express(),
    config     = require('./config').init(app),
    db         = require('monk')(config.APP.DB_URL),
    session    = require('express-session'),
    api        = require('./api')
    mail       = require('./mail'),
    auth       = require('./auth'),
    passport   = require('passport'),
    jwt        = require('jsonwebtoken'),
    expressJwt = require('express-jwt'),
    secret     = "4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$";


mail.init(config);

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({ secret: secret, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/2api/', expressJwt({secret: secret}));
app.use(require('express-validator')());

app.post('/signup', auth.signup(db, mail));
app.get ('/confirm/:token', auth.confirm(db));
app.post('/login', auth.login(db, secret, jwt));


// generic api
app.post('/api/:entity/lst', api.gLst(db)); 
app.get ('/api/:entity/get', api.gGet(db)); 
app.get ('/api/:entity/del', api.gDel(db)); 
app.post('/api/:entity/put', api.gPut(db)); 
app.post('/api/:entity/upd', api.gUpd(db)); 
//app.post('/api2/:entity/fnd', auth.logged, api.gFnd(db)); 
//app.post('/api2/:entity/agg', auth.logged, api2.gAgg(db)); 


app.all('*', function(req, res){ 
  res.status(404).json({ err: 'ROUTE_NOT_FOUND'});
});

http.createServer(app).listen(config.APP.PORT, function() { 
  console.log("\n[*] Server Listening on port %d", config.APP.PORT); 
});

