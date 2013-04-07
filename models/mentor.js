var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    extend = require('mongoose-schema-extend');

var collection = 'mentor';

var mentorSchema = new userSchema.extend({
	topicTags: [String],
	rating: float,
	reviews: [{ title: String,
				username: String,
				text: String }]
});

module.exports = mongoose.model(collection, mentorSchema);