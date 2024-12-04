const express = require('express');
const ROLE = require('../constants/ROLE');
const router = express.Router();
const moment = require('moment');

const { verifyToken, newMongoId } = require('../utils/utils');

// Importing models
const projectModel = require('../models/project.model');
const userModel = require('../models/user.model');
// const projectRoleModel = require('../models/projectRole.model');

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

        if (auth.role == ROLE.ADMIN) {
            return res.status(200).send({
                message: 'Get project info successful!',
                project: foundProject
            })
        }

        if(auth.role == ROLE.PM) {
            if (foundProject.leader._id != auth.id) {
                return res.status(401).send({
                    message: 'Unauthorized!'
                });
            }
            return res.status(200).send({
                message: 'Get project info successful!',
                project: foundProject
            });
        }

        const foundProjectRole = projectRoleModel
            .findOne({ user_id: newMongoId(auth.id), project_id: foundProject._id })
            .lean();
        
        if (!foundProjectRole) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
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


router.post('/search-project', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if(auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const project_keyword = req.body.keyword;

        let result_by_code = [];
        let result_by_name = [];

        if(auth.role == ROLE.ADMIN) {
            result_by_code = await projectModel
                .find({ code: { $regex: project_keyword, $options: 'i' } })
                .lean();
            
            result_by_name = await projectModel
                .find({ name: { $regex: project_keyword, $options: 'i' } })
                .lean();
        } else {
            result_by_code = await projectModel
                .find({ code: { $regex: project_keyword, $options: 'i' }, leader: newMongoId(auth.id) })
                .lean();
            
            result_by_name = await projectModel
                .find({ name: { $regex: project_keyword, $options: 'i' }, leader: newMongoId(auth.id) })
                .lean();
        }

        const projects = [...result_by_code, ...result_by_name];
        const uniqueProjects = Array.from(new Map(projects.map(project => [project.code, project])).values());

        return res.status(200).send({
            message: 'Search project successful!',
            projects: uniqueProjects
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
}) 

router.post('/search-user', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if(auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const user_keyword = req.body.keyword;

        let result_by_code = [];
        let result_by_name = [];

        if(auth.role == ROLE.ADMIN) {
            result_by_code = await userModel
                .find({ username: { $regex: user_keyword, $options: 'i' } })
                .lean();
            
            result_by_name = await userModel
                .find({ name: { $regex: user_keyword, $options: 'i' } })
                .lean();
        } else {
            result_by_code = await userModel
                .find({ username: { $regex: user_keyword, $options: 'i' }, leader: newMongoId(auth.id) })
                .lean();
            
            result_by_name = await userModel
                .find({ name: { $regex: user_keyword, $options: 'i' }, leader: newMongoId(auth.id) })
                .lean();
        }

        return res.status(200).send({
            message: 'Search user successful!',
            users: [...result_by_code, ...result_by_name]
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
})

router.post('/change-info', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if(auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const user = req.body;

        const parsedDate = moment.utc(user.date_of_birth, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').toDate();
        user.date_of_birth = parsedDate;
        await userModel.findOneAndUpdate({ username: user.username }, user, { new: true });

        return res.status(200).send({
            message: 'Change info successful!'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

module.exports = router;