var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TagSchema = new Schema(
    {
        name: { type: String, required: true },
        referenceCount: { type: Number, required: true, default: 0 },
    }
);

module.exports = mongoose.model('Tag', TagSchema);