const { model, Schema } = require('mongoose');
const { components } = require('../constants/documents/COMPONENT');
const { categories } = require('../constants/documents/CATEGORY');
const { modules } = require('../constants/documents/MODULE');

const fileSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        required: true
    },
    component: {
        type: Number,
        enum: components,
        required: true
    },
    category: {
        type: Number,
        enum: categories,
        required: true
    },
    module: {
        type: String,
        enum: modules,
        required: true
    },
    server_file_path: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('files', fileSchema);