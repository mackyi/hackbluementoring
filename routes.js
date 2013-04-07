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

	app.get('/user/:uid', function(req, res){
		var username = req.params.uid;
		db.findByUsername(username, function(err, user){
			if(err) return err
			var page;
			if(!user) res.render('home.jade', {locals: {
				user: req.user, message: 'User page does not exist'
			}})	
			else if(user.userType == 'mentor'){
				user.topicTags = user.topicTags.toString();
				if(req.user && user.username === req.user.username){
					page = 'mentorSelf.jade'
				} else {
					page = 'mentorPage.jade'
				}				
			} else{
				if(req.user && user.username === req.user.username){
					page ='studentSelf.jade'
				} else{
					page = 'studentPage.jade'
				}
			}
			res.render(page, {locals: {
					user: req.user, pageof: user
			}})
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
			topics: req.param('areas').split(","),
			minRating: req.param('minrating'),
			firstName: req.body.firstname,
			lastName: req.body.lastname,
			username: '',
		}
		console.log(mentorInfo);
		console.log(req.body);

		db.findMentor(mentorInfo, function(err, mentors){
			console.log(mentors);
				mentors.topicTags= mentors.topicTags.toString();
		})
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
	