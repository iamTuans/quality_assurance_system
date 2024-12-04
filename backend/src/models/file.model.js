const { model, Schema } = require('mongoose');

const fileSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('files', fileSchema);