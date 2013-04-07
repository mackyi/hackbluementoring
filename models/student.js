var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    extend = require('mongoose-schema-extend');

var collection = 'student';

var studentSchema = new userSchema.extend({
	mentorIds: [ObjectId],
	lessonIds: [ObjectId]
});

module.exports = mongoose.model(collection, studentSchema);