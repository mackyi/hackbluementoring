var passport = require('passport');

var db = require('./accessDB');

function trunc(long, next){
	if(long.length>10)
		while(long.length>10){
			if(long.lastIndexOf(',')===-1){
				long =long.substring(0, 10)+ '...';
				break;
			}
			long = long.substring(0, lastIndexOf(','));
		}
		long=long+'...';

	return next(null, long)
}

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

	app.get('/user/:uid', function(req, res){
		var username = req.params.uid;
		db.findByUsername(username, function(err, user){
			if(err) return err
			if(!user) res.render('home.jade', {locals: {
				user: req.user, message: 'User page does not exist'
			}})
			if(user.userType == 'mentor'){
				console.log(user.topicTags);
				user.topicTags = user.topicTags.toString();
				trunc(user.topicTags, function(err, short){
					user.shortTags = short;
					res.render('mentorPage.jade', {locals: {
					user: req.user, pageof: user
				}})
				});
				
			} else{
				res.render('studentPage.jade', {locals: {
					user: req.user, pageof: user
				}})
			}
		})
	})
	app.post('/register', function(req, res){
		console.log(req.body)
		db.saveUser({
			password: req.param('password'),
			username: req.param('username'),
			userType: req.param('type'),
			fname: req.param('firstName'),
			lname: req.param('lastName'),
			picUrl: req.param('picUrl'),
			topicTags: req.param('topicTags')
			}
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

	app.post('/findMentors', function(req, res){
		mentorInfo = {
			areas: req.param('areas').split(","),
			minRating: req.param('minrating'),
			firstName: req.body.firstname,
			lastName: req.body.lastname
		}
		console.log(mentorInfo);
		console.log(req.body);

		// db.findmentors(mentorInfo, function(err, mentors){
		// 		mentors.topicTags= mentors.topicTags.toString();
		// })
		mentors ={
			mentor1: {
				fname: 'Mack',
				lname: 'Yi',
				rating: '0',
				topicTags: 'math, physics, computer science',
				picUrl: 'http://sphotos-a.xx.fbcdn.net/hphotos-ash3/532386_4200069688061_127509570_n.jpg',
				username: 'mackyi'
			}
		}
		res.render('findMentors.jade', {locals:{results: mentors, user: req.user}})
	}),


	app.post('/sendRequest/:userid', function(req, res){
		parameters = req.param('requestParameters'),
		requestInfo = {
			senderID: req.user._id,
			receiverID: req.params.userid,
			date: new Date(),
			text: parameters.text,
		}

		// db.saveRequest(requestInfo, function(err, success){
		// 	if(success){
		// 		res.send(JSON.stringify({message:'Request successful'}));
		// 	}
		// })
	}),

	app.post('/acceptRequest/', function(req, res){

	})
}
	