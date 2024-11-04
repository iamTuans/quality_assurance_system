const express = require('express');
const ROLE = require('../constants/ROLE');
const router = express.Router();
const moment = require('moment');

const { verifyToken, newMongoId } = require('../utils/utils');

// Import models
const userModel = require('../models/user.model');
const projectModel = require('../models/project.model');
const projectRoleModel = require('../models/projectRole.model');

router.post('/add-user-to-project', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (!(auth.role == ROLE.PM || auth.role == ROLE.ADMIN)) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const { username, project_code, role } = req.body;

        const foundUser = await userModel
            .findOne({ username });
        if (!foundUser) {
            return res.status(400).send({
                message: 'User not found!'
            });
        }

        const foundProject = await projectModel
            .findOne({ code: project_code });
        if (!foundProject) {
            return res.status(400).send({
                message: 'Project not found!'
            });
        }

        const foundProjectRole = await projectRoleModel
            .findOne({ user_id: newMongoId(foundUser._id), project_id: newMongoId(foundProject._id) });
        if (foundProjectRole) {
            return res.status(400).send({
                message: 'User already in project!'
            });
        }

        const newProjectRole = new projectRoleModel({
            user_id: newMongoId(foundUser._id),
            project_id: newMongoId(foundProject._id),
            role,
        });

        const valid_project_role = [
            ROLE.DEV, 
            ROLE.TEST, 
            ROLE.BA, 
            ROLE.QA, 
            ROLE.UIUX, 
            ROLE.PD
        ];
        if (!valid_project_role.includes(role)) {
            return res.status(400).send({
                message: 'Invalid role!'
            });
        }

        await newProjectRole.save();
        return res.status(200).send({
            message: 'User added to project!'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

router.post('/change-project-info', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (!(auth.role == ROLE.PM || auth.role == ROLE.ADMIN)) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        let {
            project_code,
            name,
            rank,
            category,
            start_date,
            end_date,
            customer,
            status,
        } = req.body;

        const foundProject = await projectModel
            .findOne({ code: project_code });
        if (!foundProject) {
            return res.status(400).send({
                message: 'Project not found!'
            });
        }

        start_date = moment.utc(start_date, 'DD/MM/YYYY').toDate(); //utc cho dung ngay, khong bi lech ngay
        end_date = moment.utc(end_date, 'DD/MM/YYYY').toDate();
        
        if (end_date <= start_date) {
            return res.status(400).send({
                message: 'Invalid date!'
            });
        }

        await projectModel.findByIdAndUpdate(
            foundProject._id,
            {
                name,
                rank,
                category,
                start_date,
                end_date,
                customer,
                status,
            }
        );

        return res.status(200).send({
            message: 'Project info changed!'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

module.exports = router;