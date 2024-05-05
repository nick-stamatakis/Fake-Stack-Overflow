var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema(
    {
        username: {type: String, required: true },
        email: {type: String, required: true },
        password: {type: String, required: true },
        questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
        reputation: {type: Number, required: true, default: 0},
        member_since: { type: Date, default: Date.now()},
    }
);

module.exports = mongoose.model('User', UserSchema);