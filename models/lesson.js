var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Assignment = require('./assignments');

var collection = 'lesson';

var lessonSchema = new Schema({
	name: String,
	mentorUsername: String,
	studentUsername: String,
	dateStarted: Date,
	assignments: [Assignment],
	chats: {
		username: String,
		date: Date,
		text: String
	}
});

module.exports = mongoose.model(collection, lessonSchema);