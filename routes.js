var passport = require('passport');

var db = require('./accessDB');

module.exports = function(app){
	app.get('/', function(req, res) {
		console.log(req.user);
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

	app.get('/findMentors', function(req, res){
		res.render('findMentors.jade', {locals:{
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
	}),

	app.get('/logout', function(req, res){
	     req.logout();
	     res.redirect('/');
	}),

	app.post('/searchMentors', function(req, res){
		parameters = req.param('searchParameters');
		mentorInfo = {
			minRating: req.param('minRating'),
			firstName: req.param('firstName'),
			lastName: req.param('lastName'),
			areas: req.param('areas').split(",")
		}
		db.findmentors(mentorInfo, function(err, mentors){
			res.send(JSON.stringify(mentors));
		})
	}),


	app.post('/sendRequest/:userid', function(req, res){
		parameters = req.param('requestParameters'),
		requestInfo = {
			senderID: req.user._id,
			receiverID: req.params.userid,
			date: new Date(),
			text: parameters.text,
		}
		db.saveRequest(requestInfo, function(err, success){
			if(success){
				res.send(JSON.stringify({message:'Request successful'}));
			}
		})
	}),

	app.post('/acceptRequest/', function(req, res){

	})
}
	