var passport = require('passport');

var db = require('./accessDB');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
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
			if(err) {return}
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

	app.post('/updateinfo/picUrl', function(req, res){
		if(req.user){
			db.updatePicUrl(req.user.username, req.param('picUrl'));
			res.redirect('/user/' + req.user.username)
		} else{
			res.render('home.jade', {locals: {user: req.user, message: "You do not have permission to do that"}});
		}
	}),
	app.post('/updateinfo/lname', function(req, res){
		if(req.user){
			db.updateLname(req.user.username, req.param('lname'));
			res.redirect('/user/' + req.user.username)
		} else{
			res.render('home.jade', {locals: {user: req.user, message: "You do not have permission to do that"}});
		}
	}),
	app.post('/updateinfo/fname', function(req, res){
		if(req.user){
			db.updateFname(req.user.username, req.param('fname'));
			res.redirect('/user/' + req.user.username)
		} else{
			res.render('home.jade', {locals: {user: req.user, message: "You do not have permission to do that"}});
		}
	}),
	app.post('/updateinfo/password', function(req, res){
		if(req.user){
			db.updatePassword(req.user.username, req.param('password'));
			res.redirect('/user/' + req.user.username)
		} else{
			res.render('home.jade', {locals: {user: req.user, message: "You do not have permission to do that"}});
		}
	}),


	app.get('/logout', function(req, res){
	     req.logout();
	     res.redirect('/');
	}),

	app.post('/findMentors', function(req, res){
		mentorInfo = {
			topics: req.param('areas').split(","),
			minRating: req.param('minrating'),
			fname: req.body.firstname,
			lname: req.body.lastname,
			username: '',
		}
		console.log(mentorInfo);
		console.log(req.body);

		db.findMentor(mentorInfo, function(err, mentors){
			console.log(mentors);
//			mentors.topicTags= mentors.topicTags.toString();
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

	app.get('/lesson/:lid', ensureAuthenticated, function(req, res){
		lid = req.params.lid;
		db.findLesson(lid, function(err, lesson){
			db.findAssignments(lid, function(err, assignments){
				console.log(assignments);
				res.render('lesson.jade', {locals: { user: req.user, lesson: lesson, assignments: assignments}})
			})
		})
	})

	app.post('/addAssignment/:lid', function(req, res){
		var lid = req.params.lid;
		console.log(lid);
		var assignmentInfo = {
			name: req.param('name'),
			text: req.param('text')
		}
		console.log(assignmentInfo)
		db.addAssignment(assignmentInfo, lid, function(err){
			if(!err) res.redirect('/lesson/' + lid);
		})
	}),

	app.get('/writeRequest/:toname', ensureAuthenticated, function(req, res){
		res.render('writeRequest.jade', {locals: {user: req.user, mentorname: req.param('toname')}})
	}),
	app.post('/sendRequest/:fromname/:toname', function(req, res){
		parameters = req.param('requestParameters'),
		studentName= req.params.fromname,
		mentorName=  req.params.toname,
		text= req.param('text'),
		db.addMentorRequest(studentName, mentorName, text, function(err, success){
			if(!err){
				res.redirect('/user/' + req.params.toname);
			}
		})
	}),

	app.get('/acceptRequest/:fromname/:toname', function(req, res){
		lessonInfo = {
			studentUsername : req.params.fromname,
			mentorUsername : req.params.toname,
			name : req.params.toname +req.params.fromname
		}
		db.createLesson(lessonInfo, function(err, lessonid){
			if(err) return res.redirect('/')
			console.log(lessonid)
			console.log(req.params.toname)
			db.addLesson(req.params.toname, lessonid, function(){
				db.addLesson(req.params.fromname, lessonid, function(){
					res.redirect('/user/' + req.params.toname)
				})
			})
		})
	})
}
	