const express = require('express');
const ROLE = require('../constants/ROLE');
const router = express.Router();
const moment = require('moment');
const PROJECT = require('../constants/PROJECT');

const { verifyToken, newMongoId } = require('../utils/utils');

// Import models
const userModel = require('../models/user.model');
const projectModel = require('../models/project.model');
const projectRoleModel = require('../models/projectRole.model');
const actionModel = require('../models/action.model');

router.post('/add-user-to-project', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (!(auth.role == ROLE.PM || auth.role == ROLE.ADMIN)) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const {
            username,
            project_code,
            role,
            start_date,
            end_date
        } = req.body;

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
        if (foundProjectRole && moment(foundProjectRole.end_date).isAfter(moment())) {
            return res.status(400).send({
                message: 'User already in project!'
            });
        }

        if (foundProject.leader.toString() === foundUser._id.toString()) {
            return res.status(400).send({
                message: 'User already in project!'
            });
        }

        const parsedStartDate = moment.utc(start_date, 'DD-MM-YYYY').toDate();
        const parsedEndDate = moment.utc(end_date, 'DD-MM-YYYY').toDate();

        if (end_date <= start_date) {
            return res.status(400).send({
                message: 'Invalid date!'
            });
        }

        const valid_project_role = [
            ROLE.DEV, 
            ROLE.TEST, 
            ROLE.BA, 
            ROLE.QA, 
            ROLE.UIUX, 
            ROLE.PD,
            ROLE.CM
        ];
        if (!valid_project_role.includes(role)) {
            return res.status(400).send({
                message: 'Invalid role!'
            });
        }

        await projectRoleModel.findOneAndUpdate({
            user_id: newMongoId(foundUser._id),
            project_id: newMongoId(foundProject._id),
        }, {
            user_id: newMongoId(foundUser._id),
            project_id: newMongoId(foundProject._id),
            role,
            start_date: parsedStartDate,
            end_date: parsedEndDate
        }, {
            upsert: true,
            new: true
        });


        const newAction = new actionModel({
            action_user: newMongoId(auth.id),
            action_project: newMongoId(foundProject._id),
            action_name: `${auth.username} added ${foundUser.username} to project ${foundProject.name}`
        });
        await newAction.save();

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
            code,
            name,
            rank,
            category,
            start_date,
            end_date,
            customer,
            status,
        } = req.body;
        if(PROJECT.RANK.indexOf('A') === -1) { //check rank chi nhap dc ABCD
            return res.status(400).send({
                message: 'Invalid rank!'
            });
        }

        if(PROJECT.CATEGORY.indexOf(category) === -1) {
            return res.status(400).send({
                message: 'Invalid category!'
            });
        }

        if(!PROJECT.STATUS.indexOf(status) === -1) {
            return res.status(400).send({
                message: 'Invalid status!'
            });
        }

        const foundProject = await projectModel
            .findOne({ code });
        if (!foundProject) {
            return res.status(400).send({
                message: 'Project not found!'
            });
        }

        const parsedStartDate = moment.utc(start_date, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').toDate();
        const parsedEndDate = moment.utc(end_date, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').toDate();
        
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
                start_date: parsedStartDate,
                end_date: parsedEndDate,
                customer,
                status,
            }
        );

        const newAction = new actionModel({
            action_user: newMongoId(auth.id),
            action_project: newMongoId(foundProject._id),
            action_name: `Project ${foundProject.code} info changed by ${auth.username}`
        });
        await newAction.save();

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