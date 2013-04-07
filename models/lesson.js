var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var collection = 'lesson';

var lessonSchema = new Schema({
	name: String,
	dateStarted: Date,
	assignments: [ObjectId],
	chats: {
		username: String,
		date: Date,
		text: String
	}
});

module.exports = mongoose.model(collection, lessonSchema);