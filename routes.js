var passport = require('passport');

var db = require('./accessDB');

module.exports = function(app){
	app.get('/', function(req, res) {
		res.render('home.jade', {user: req.user});
	}),

	app.get('/register', function(req, res){
		res.render('register.jade', {locals:{
				user: req.user}});
	}),
	
	app.get('/login', function(req, res){
		res.render('login.jade', {locals:{
				user: req.user}});
	}),

	app.post('/register', function(req, res){
		db.saveUser({
			password: req.param('password'),
			username: req.param('username')}
			, function(err,docs, msg) {
				if(docs == null){
					res.render('register.jade', {locals: {
						message: msg
					}})
				} else{
					res.redirect('/');
				} 	
		})
	}),

	app.post('/login', function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      return res.render('login.jade', {locals: info}); 
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/');
	    });
	  })(req, res, next);
	});

	app.get('/logout', function(req, res){
	     req.logout();
	     res.redirect('/');
	})

	app.post('/searchMentors', function(req, res){
		parameters = req.param('searchParameters');
		minRating = parameters.minRating;
		firstName = parameters.firstname;
		lastName = parameters.lastname;
		areas = parameters.areas.split(",");
	})

	app.post('/searchStudents', function(req, res){

	}
}
	