#!/usr/bin/env node

var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash');
var validator = require('express-validator');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// creates a login session variable if none exists.
// default: false
// check if logged in
// redirect non-logged in user away from maintain pages 
app.use(function(req,res,next){
    let login = req.session.login;
    if(!login)
    {
      login = req.session.login = false;
    }
    if(!login){
    
      if(req.path.indexOf("/maintain") >= 0)
      {
        
        res.redirect("/");
        return;
      }
    }
   
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
