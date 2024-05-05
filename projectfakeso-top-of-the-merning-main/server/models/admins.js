var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AdminSchema = new Schema(
    {
        username: {type: String, required: true },
        email: {type: String, required: true },
        password: {type: String, required: true },
        questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
        users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        reputation: {type: Number, default: 1000},
        member_since: { type: Date, default: Date.now()},
    }
);

module.exports = mongoose.model('Admin', AdminSchema);