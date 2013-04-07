var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//    bcrypt = require('bcrypt');

var collection = 'user';

var userSchema = new Schema({
  username: { type: String, unique: true},
  hash:{type: String},
  fname: String,
  lname: String,
  picUrl: String,
  lessonIds: [ObjectId],
  mentorRequests: [{
  	studentId: ObjectId,
  	mentorId: ObjectId,
  	text: String,
  	requestDate: Date
  }]
});
 
userSchema.methods.verifyPassword = function(password, callback) {
	var res = this.password = password;
	return callback(null, res);
  // bcrypt.compare(password, this.hash, function(err, res) {
  // 	if(err) return callback(err, null);
  //   return callback(err, res);
  // });
};

module.exports = mongoose.model(collection, userSchema);