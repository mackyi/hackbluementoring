// Module dependencies
var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');
// var scrypt = require("scrypt");

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');


        


var testuser = new User({
	username: 'bgaston',
	hash:'pass',
	userType: 'student',				//'mentor' or 'student'
	fname: 'Bryan',
	lname: 'Gaston',
	picUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/c33.33.411.411/s160x160/321163_10100317922487608_2052502439_n.jpg'					//URL of profile pic
/*	lessonIds: [ObjectId],			//mentor only - all lessons the mentor is teaching
	mentorRequests: [{				//student can request to work with a mentor
		studentId: ObjectId,
  		mentorId: ObjectId,
  		text: String,
  		requestDate: Date
  	}],
  	mentorIds: [ObjectId],			//if student, these are all the associated mentors
  	lessonIds: [ObjectId],			//if mentor, these are all associated students
	topicTags: [String],
	rating: float,					//mentor only
	reviews: [{ title: String,		//mentor only
				username: String,
				text: String }]  
*/
});
/*
testuser.save(function(err) {
	if (err) {throw err;}
});
*/



User.find(function(err, users){ console.log(users);} );





var SALT_WORK_FACTOR =10;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, {message: 'Unknown user ' + username}); }
      user.verifyPassword(password, function(err, valid){ 
        if(err) return done(err);
        if(!valid) return done(null, false, {message: 'Invalid password'});
        return done(null, user);
      })
    });
  }
));

// serialize user on login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


// connect to database
module.exports = {
  // initialize DB
  startup: function(dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function() {
      console.log('We have connected to mongodb');
    }); 

  },

  saveUser: function(userInfo, callback){
    User.findOne({username: userInfo.username}, function (err, user){
      if(user){
        callback(null, null, "Username taken");
      } else {
        var newUser = new User({
                username: userInfo.username,
                hash: userInfo.password,
                userType: userInfo.userType,
                fname: userInfo.fname,
                lname: userInfo.lname,
                picUrl: userInfo.picUrl,
                topicTags: userInfo.topicTags
              });
        newUser.save(function(err) {
          if (err) {throw err;}
          callback(null, userInfo);
        });

        // bcrypt.genSalt(10, function(err, salt) {
        //   console.log(userInfo.password);
        //   bcrypt.hash(userInfo.password, salt, function(err, pwdhash) {
        //       if (!err) {
        //       //pwdhash should now be stored in the database
        //       var newUser = new User({
        //         username: userInfo.username,
        //         hash: pwdhash
        //       });
        //       newUser.save(function(err) {
        //         if (err) {throw err;}
        //         callback(null, userInfo);
        //       });
        //   }
        //   });
        // });  
      }
    });
  },
  
	findByUsername: function(username, callback){
    User.findOne({username: username}, function (err, user){
      if(err) callback(err, null)
      if(user){
        callback(null, user);
      } else {
        callback(null, null);
      }
    }).lean();
  },  
  
  
  
	//to-do: this probably doesn't work if any of the values is null...
	findMentor: function(mentorInfo, callback){
//    var userInfo;

    // for each property in mentorInfo 
    //   if value!=''
    //     userInfo.property = 
		User.find({
			username: mentorInfo.username, 
			fname: mentorInfo.fname,
			lname: mentorInfo.lname,
			rating: { $gte: mentorInfo.rating },
			topic: { $in: mentorInfo.topics }
		}, function (err, mentors){
			if (!err){
				callback(null, mentors);
			}
			else callback(err);
		}).lean();
	},

/*
	addReview: function(studentUsername, mentorUsername, title, text, rating, reviewDate){
		User.update({ username: mentorUsername }, 
			{ $push: { reviews: [{ 
				title: title,
				username: studentUsername,
				text: text,
				rating: rating,
				reviewDate: new Date(); }] } }, 
			{ upsert: true }, function(err) {
				if (!err){
					User.aggregate([
						{ $group: {
							title: '$reviews.title',
							ratingAvg: { $avg: '$reviews.rating'}
						}}
						], function (err, results) {
							if (err) {
								console.error(err);
							} else {
								//to-do: update mentor's rating
								console.log(results);
							}
						}
					);
				}
				else console.log(err);
			});	
	},
*/	
	addTopicTag: function(username, newTags){
		User.update({ username: username }, 
			{ $addToSet: { topicTags: newTags } }, 
			{ upsert: true });	
	},
	
	addMentor: function(studentUsername, mentorUsername){
		User.update({ username: studentUsername }, 
			{ $push: { mentors: mentorUsername } }, 
			{ upsert: true });	
	},
	
	addMentorRequest: function(studentUsername, mentorUsername, text){
		//add mentor request to student record
		User.update({ username: studentUsername }, 
			{ $push: { mentorRequests: [{ 
				studentUsername: studentUsername,
				mentorUsername: mentorUsername,
				text: text,
<<<<<<< HEAD
				requestDate: new Date()}] } }, 
=======
				requestDate: new Date() }] } }, 
>>>>>>> 2f744882f598ae5cb2a941a3dcabde6567017175
			{ upsert: true });
		
		//add mentor request to mentor record
		User.update({ username: mentorUsername }, 
			{ $push: { mentorRequests: [{ 
				studentUsername: studentUsername,
				mentorUsername: mentorUsername,
				text: text,
<<<<<<< HEAD
				requestDate: new Date()}] } }, 
=======
				requestDate: new Date() }] } }, 
>>>>>>> 2f744882f598ae5cb2a941a3dcabde6567017175
			{ upsert: true });		
	},

	updatePassword: function(username, newValue){
		User.update({ username: username }, { hash: newValue }).exec();
	},
	
	updateFname: function(username, newValue){
		User.update({ username: username }, { fname: newValue }).exec();
	},	
		
	updateLname: function(username, newValue){
		User.update({ username: username }, { lname: newValue }).exec();
	},		
		
	updatePicUrl: function(username, newValue){
		User.update({ username: username }, { picUrl: newValue }).exec();
	},		
		
	addLesson: function(username, newValue){
		User.update({ username: username }, {$addToSet: { lessonIds: newValue }}, {upsert:true}).exec();
	},		
		
	//for bulk updating user info from "update profile" page	
    updateUser: function(userInfo, callback){    
      User.update({ username: userInfo.username }, { 
		hash: userInfo.password,
		fname: userInfo.fname,
		lname: userInfo.lname,
		bio: userInfo.bio,
		picUrl: userInfo.picUrl,
		topicTags: userInfo.topicTags
      }, function (err, numberAffected, raw) {
		  if (err) callback(err);
		  else callback(null, null, "Updated info for " + userInfo.username);
		}).exec();
  	},

  // disconnect from database
  closeDB: function(){
    mongoose.disconnect();
  },

}