var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AnswerSchema = new Schema(
    {
        text: { type: String, required: true },
        ans_by: { type: String, required: true},
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        ans_date_time: { type: Date, default: Date.now() },
        vote: {type: Number, default: 0 },
    }
);

module.exports = mongoose.model('Answer', AnswerSchema);