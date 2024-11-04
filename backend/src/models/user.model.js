const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true // truong du lieu co bat buoc hay khong?
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
            'qa',
            'dev',
            'ba',
            'uiux',
            'tester',
            'cm',
            'pd',
            'po',
            'user' //role trong hệ thống
        ],
        default: 'user',
        required: true,
    }
}, {
    timestamps: true // luu lai ngay gio tao data, createAt
});

module.exports = model(`users`, userSchema);