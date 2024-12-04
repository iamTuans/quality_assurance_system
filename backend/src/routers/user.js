const express = require('express');
const ROLE = require('../constants/ROLE');
const router = express.Router();
const moment = require('moment');
const PROJECT = require('../constants/PROJECT');

const { verifyToken, newMongoId } = require('../utils/utils');

// Import models
const projectModel = require('../models/project.model');


router.get('/get-projects', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth?.role != ROLE.BA) { //kiemtra role 
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const projects = await projectModel
            .find({ leader: newMongoId(auth.id)})
            .populate('creator', 'username')
            .populate('leader', 'username');
        return res.status(200).send({
            projects
        });
    } catch (err) {
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

module.exports = router;