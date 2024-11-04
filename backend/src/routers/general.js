const express = require('express');
const ROLE = require('../constants/ROLE');
const router = express.Router();

const { verifyToken, newMongoId } = require('../utils/utils');

// Importing models
const projectModel = require('../models/project.model');

router.get('/get-project-info', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if(auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const { project_code } = req.query;
        const foundProject = await projectModel
            .findOne({ code: project_code })
            .populate('creator', 'username')
            .populate('leader', 'username')
            .lean();
        if (!foundProject) {
            return res.status(400).send({
                message: 'Project not found!'
            });
        }

        console.log(foundProject);

        if (auth.role == ROLE.PM || auth.role == ROLE.ADMIN) {
            return res.status(200).send({
                message: 'Get project info successful!',
                project: foundProject
            })
        }

        if (auth.role == ROLE.BA) {
            return res.status(200).send({
                message: 'Get project info successful!',
                project: {
                    code: foundProject.code,
                    name: foundProject.name,
                    rank: foundProject.rank,
                    category: foundProject.category,
                    start_date: foundProject.start_date,
                    end_date: foundProject.end_date
                }
            });
        }

        return res.status(200).send({
            message: 'Get project info successful!',
            project: {
                name: foundProject.name,
            }
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

module.exports = router;