var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//    bcrypt = require('bcrypt');

var collection = 'user';

var schema = new Schema({
  username: { type: String, unique: true},
  hash:{type: String}
});

schema.methods.verifyPassword = function(password, callback) {
	var res = this.password = password;
	return callback(null, res);
  // bcrypt.compare(password, this.hash, function(err, res) {
  // 	if(err) return callback(err, null);
  //   return callback(err, res);
  // });
};

module.exports = mongoose.model(collection, schema);