const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); //thư viện mã hóa mật khẩu

const router = express.Router();

const {
    verifyToken
} = require('../utils/utils');

//Import Models
const userModel = require('../models/user.model');

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    //check db

    const foundUser = await userModel
        .findOne({username}); //check user xem co hay khong
    if(!foundUser){
        return res.status(400).send({
            message: 'User not found!'
        });
    }
    
    const passwordMatch = await bcrypt.compare(password, foundUser.password);// sử dụng hàm compare so sánh pasword với foundUser.pasword xem có giống nhau hay k

    if(passwordMatch) {
        const payload = {
            _id: foundUser._id,
            username: foundUser.username,
            role: foundUser.role
        }
        const token = jwt.sign (payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.status(200).send({
            message: 'Login successful!',
            token
        });
    } else {
        return res.status(200).send({
            message: 'Login failed!'
        });
    }
});

router.post('/verify', verifyToken, (req, res) => {
    const auth = req.auth;

    if(!auth.verified) {
        return res.status(401).send({
            message: 'Unauthorized!'
        });
    }
    auth.verified = undefined;
    return res.status(200).send({
        message: 'Authorized!',
        auth: auth
    });
});

module.exports = router;