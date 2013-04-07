var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//    bcrypt = require('bcrypt');

var collection = 'user';

var userSchema = new Schema({
	username: { type: String, unique: true},
	hash:{type: String},
	userType: String,				//'mentor' or 'student'
	fname: String,
	lname: String,
	bio: String,
	picUrl: String,					//URL of profile pic
	lessonIds: [ObjectId],			//mentor only - all lessons the mentor is teaching
	mentorRequests: [{				//student can request to work with a mentor
		studentUsername: String,
  		mentorUsername: String,
  		text: String,
  		requestDate: Date
  	}],
  	mentors: [String],				//if student, these are all the associated mentors
  	students: [String],				//if mentor, these are all associated students
  	lessonIds: [ObjectId],			//if mentor, these are all associated lessons
	topicTags: [String],
	rating: Number,					//mentor only
	reviews: [{ title: String,		//mentor only
				username: String,
				rating: Number,
				text: String,
				reviewDate: Date }]  
});
 
userSchema.methods.verifyPassword = function(password, callback) {
	return callback(null, true);
  // bcrypt.compare(password, this.hash, function(err, res) {
  // 	if(err) return callback(err, null);
  //   return callback(err, res);
  // });
};

module.exports = mongoose.model(collection, userSchema);