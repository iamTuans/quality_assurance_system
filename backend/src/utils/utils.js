const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userModel = require('../models/user.model');

const verifyToken = (req, _, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) {
            req.auth = {
                role: 'unauthorized',
                verified: false
            };
        } else {
            const foundUser = await userModel.findOne({ username: data.username });
            if (!foundUser) {
                req.auth = {
                    role: 'unauthorized',
                    verified: false
                };
            } else {
                req.auth = {
                    role: data.role,
                    username: data.username,
                    id: data._id,
                    verified: true
                };
            }
        }
        next();
    });
}

const newMongoId = (id) => {
    return new mongoose.Types.ObjectId(id);
}

module.exports = {
    verifyToken,
    newMongoId
}