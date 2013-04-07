// Module dependencies
var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');
// var scrypt = require("scrypt");

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

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
                hash: userInfo.password
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
  // disconnect from database
  closeDB: function(){
    mongoose.disconnect();
  },

}