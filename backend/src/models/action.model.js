const { model, Schema } = require('mongoose');

const actionSchema = new Schema({
    action_user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    action_project: {
        type: Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    },
    action_name: {
        type: String,
        required: true
    },
    action_time: {
        type: Date,
        default: Date.now()
    },
}, {
    timestamps: true
});

module.exports = model('actions', actionSchema);