var express = require('express'),
  mongodb = require('mongodb'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  stylus = require('stylus');

db = require('./accessDB')

var app = express();

db.startup('mongodb://localhost/hackblue');


function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(stylus.middleware({
      src: __dirname + '/views'
    , dest: __dirname + '/public'
    , compile: compile
    , force: true
    , compress: true
    }
  ))

  app.use(express.static('public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: 'lalaalalalaaa'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  
});

app.configure('development', function(){
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

require('./routes')(app);
var port = (process.env.VMC_APP_PORT || 3000);

app.listen(port, function() {
  console.log("Listening on " + port);
});

