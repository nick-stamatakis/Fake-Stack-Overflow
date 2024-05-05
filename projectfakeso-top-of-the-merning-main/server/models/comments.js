var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema(
    {
        commented_by: { type: String, required: true, maxLength: 140 },
        text: { type: String, required: true },
        comment_time: { type: Date, default: Date.now() },
        vote: { type: Number, default: 0 },
    }
);

module.exports = mongoose.model('Comment', CommentSchema);