const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true // truong du lieu co bat buoc hay khong?
    },
    full_name: {
        type: String,
        default: null,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: null
    },
    date_of_birth: {
        type: Date,
        default: null
    },
    job: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    company: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'admin',
            'pm',
            'user' //role trong hệ thống
        ],
        default: 'user',
        required: true,
    }
}, {
    timestamps: true // luu lai ngay gio tao data, createAt
});

module.exports = model(`users`, userSchema);