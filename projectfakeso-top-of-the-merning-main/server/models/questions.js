var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var QuestionSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 50 },
        summary: { type: String, required: true, maxLength: 140 },
        text: { type: String, required: true },
        asked_by: { type: String, default: "Anonymous" },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }],
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        ask_date_time: { type: Date, default: Date.now() },
        views: { type: Number, default: 0 },
        vote: { type: Number, default: 0 },
    }
);

module.exports = mongoose.model('Question', QuestionSchema);