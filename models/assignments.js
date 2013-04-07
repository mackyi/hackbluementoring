var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var collection = 'assignment';

var assignmentSchema = new Schema({
	name: String,
	text: String,
	feedback: String,
	picUrls: [String],
	vidUrls: [String],
	comments: {
		username: String,
		date: Date,
		text: String
	}
});

module.exports = mongoose.model(collection, assignmentSchema);