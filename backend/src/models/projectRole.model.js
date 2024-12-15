const { model, Schema } = require('mongoose');

const projectRoleSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    },
    role: {
        type: String,
        enum: ['dev', 'tester', 'ba', 'qa', 'uiux', 'pd', 'cm'],
        required: true,
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
}, {
    timestamps: true
});

module.exports = model('project_roles', projectRoleSchema);