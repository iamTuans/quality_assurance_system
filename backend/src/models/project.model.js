const { model, Schema } = require('mongoose');

const projectSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    rank: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: false
    },
    category: {
        type: String,
        enum: ['SW', 'HW'],
        required: false,
    },
    start_date: {
        type: Date,
        required: false
    },
    end_date: {
        type: Date,
        required: false
    },
    customer: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['open', 'pending', 'close'],
        required: false
    }
}, {
    timestamps: true
});

module.exports = model('projects', projectSchema);