"use strict";
exports.__esModule = true;
var http = require("http");
var express = require("express");
var cors = require("cors");
var monk = require("monk");
var session = require("express-session");
var passport = require("passport");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
var settings = require("./config");
var mail_1 = require("./mail");
var auth_1 = require("./auth");
var errors_1 = require("./errors");
var app = express();
var config = settings.init(app);
var db = monk(config.APP.DB_URL);
var secret = "4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$";
mail_1["default"].init(config);
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(session({ secret: secret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/', expressJwt({ secret: secret }));
app.use(require('express-validator')());
app.post('/signup', auth_1["default"].signup(db, mail_1["default"]));
app.get('/confirm/:token', auth_1["default"].confirm(db));
app.post('/login', auth_1["default"].login(db, secret, jwt));
// generic api
app.post('/api/:entity/lst', api.gLst(db));
app.get('/api/:entity/get', api.gGet(db));
app.get('/api/:entity/del', api.gDel(db));
app.post('/api/:entity/put', api.gPut(db));
app.post('/api/:entity/upd', api.gUpd(db));
// Global error handler
app.use(function (err, req, res, next) {
    if (!('error' in err)) {
        console.log(err.stack); // Log stack error in console
        res.status(500).send(errors_1["default"].type.SERVER_ERROR);
        return;
    }
    if (!(err.error in errors_1["default"].type)) {
        res.status(500).send(errors_1["default"].type.SERVER_ERROR);
        return;
    }
    var e = errors_1["default"].type[err.error];
    delete err.error;
    e.error = Object.assign({}, e.error, err);
    res.status(e.error.code).json(e);
});
app.all('*', function (req, res) {
    res.status(404).json(errors_1["default"].type.NOT_FOUND);
});
http.createServer(app).listen(config.APP.PORT, function () {
    console.log(config.APP.DB_URL);
    console.log("\n[*] Server Listening on port %d", config.APP.PORT);
});
