const express = require('express');
const ROLE = require('../constants/ROLE');
const router = express.Router();
const moment = require('moment');
const bcrypt = require("bcrypt"); //thư viện mã hóa mật khẩu

const { components } = require('../constants/documents/COMPONENT');
const { categories } = require('../constants/documents/CATEGORY');
const { modules } = require('../constants/documents/MODULE');

const { verifyToken, newMongoId } = require('../utils/utils');

// Importing models
const projectModel = require('../models/project.model');
const userModel = require('../models/user.model');
const projectRoleModel = require('../models/projectRole.model');
const fileModel = require('../models/file.model');
const actionModel = require('../models/action.model');

router.post('/change-password', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const foundUser = await userModel.findById(newMongoId(auth.id));
        if (!foundUser) {
            return res.status(400).send({
                message: 'User not found!'
            });
        }

        const { old_password, new_password } = req.body;
        const passwordMatch = await bcrypt.compare(old_password, foundUser.password);
        if (!passwordMatch) {
            return res.status(400).send({
                message: 'Old password is incorrect!'
            });
        }
        const hashedPassword = await bcrypt.hash(new_password, 10);
        foundUser.password = hashedPassword;
        await foundUser.save();

        return res.status(200).send({
            message: 'Change password successful!'
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

router.get('/get-actions', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        if (auth.role == ROLE.ADMIN) {
            const actions = await actionModel
                .find()
                .populate('action_user', 'username')
                .lean();
            return res.status(200).send({
                message: 'Get actions successful!',
                actions: actions
            });
        }

        const { project_code } = req.query;
        if (project_code) {
            const foundProject = await projectModel.findOne({ code: project_code });
            if (!foundProject) {
                return res.status(400).send({
                    message: 'Project not found!'
                });
            }
            const foundProjectRole = await projectRoleModel
                .findOne({ user_id: newMongoId(auth.id), project_id: foundProject._id });
            const userInProject = (foundProject.leader == auth.id || foundProjectRole || auth.role == ROLE.ADMIN);
            if (!userInProject) {
                return res.status(401).send({
                    message: 'Unauthorized!'
                });
            }

            const actions = await actionModel
                .find({ action_project: foundProject._id })
                .populate('action_user', 'username')
                .lean();
            return res.status(200).send({
                message: 'Get actions successful!',
                actions: actions
            })
        } else {
            const projectsIsLeader = await projectModel
                .find({ leader: newMongoId(auth.id) })
                .populate('creator', 'username')
                .populate('leader', 'username');

            const projectIsMember = await projectRoleModel
                .find({ user_id: newMongoId(auth.id) })
                .populate({
                    path: 'project_id',
                    select: 'code name creator leader rank category start_date end_date status',
                    populate: [
                        { path: 'leader', select: 'username' },
                        { path: 'creator', select: 'username' }
                    ]
                })
                .populate('user_id', 'username');

            const projects = [...projectsIsLeader.map(project => project._id), ...projectIsMember.map(project => project?.project_id?._id)];
            const actions = await actionModel
                .find({ action_project: { $in: projects } })
                .populate('action_user', 'username')
                .lean();
            return res.status(200).send({
                message: 'Get actions successful!',
                actions: actions
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }

});

router.get('/get-resources', verifyToken, async (req, res) => {
    try {

        const auth = req.auth;
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const { project_code } = req.query;
        const foundProject = await projectModel.findOne({ code: project_code });
        if (!foundProject) {
            return res.status(400).send({
                message: 'Project not found!'
            });
        }

        const resources = await fileModel
            .find({ project: foundProject._id })
            .populate('creator', 'username')
            .lean();

        return res.status(200).send({
            message: 'Get resources successful!',
            resources: resources
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

//change resource
router.post('/change-resource', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth.role === ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        let {
            name,
            version,
            description,
            component,
            category,
            module
        } = req.body;

        if (components.indexOf(component) === -1) {
            return res.status(400).send({
                message: 'Invalid component!'
            });
        }

        if (categories.indexOf(category) === -1) {
            return res.status(400).send({
                message: 'Invalid category!'
            });
        }

        if (modules.indexOf(module) === -1) {
            return res.status(400).send({
                message: 'Invalid module!'
            });
        }

        const foundFile = await fileModel
            .findOne({ file_id: newMongoId(foundFile._id)});
        if (!foundFile) {
            return res.status(404).send({
                message: 'File not found!'
            });
        }

        await fileModel.findByIdAndUpdate(
            foundFile._id,
            {
                name,
                version,
                description,
                component,
                category,
                module,
            }
        );

        return res.status(200).send({
            message: 'Change resource successful!'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

router.get('/get-project-info', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth.role == ROLE.UNAUTHORIZED) {
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

        return res.status(200).send({
            message: 'Get project info successful!',
            project: foundProject
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
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const project_keyword = req.body.keyword;

        let result_by_code = [];
        let result_by_name = [];

        if (auth.role == ROLE.ADMIN) {
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
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const user_keyword = req.body.keyword;

        let result_by_code = [];
        let result_by_name = [];

        if (auth.role == ROLE.ADMIN) {
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
        if (auth.role == ROLE.UNAUTHORIZED) {
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

router.get('/get-users-in-project', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const { project_code } = req.query;

        const foundProject = await projectModel.findOne({ code: project_code });
        if (!foundProject) {
            return res.status(400).send({
                message: 'Project not found!'
            });
        }

        const foundProjectRole = await projectRoleModel
            .findOne({ user_id: newMongoId(auth.id), project_id: foundProject._id });

        const userInProject = (foundProject.leader == auth.id || foundProjectRole || auth.role == ROLE.ADMIN);
        if (!userInProject) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const users = await projectRoleModel
            .find({ project_id: foundProject._id })
            .populate('user_id', 'username full_name')
            .lean();

        return res.status(200).send({
            message: 'Get users in project successful!',
            users: users
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Internal server error!'
        });
    }
});

router.get('/get-projects', verifyToken, async (req, res) => {
    try {
        const auth = req.auth;
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const projectsIsLeader = await projectModel
            .find({ leader: newMongoId(auth.id) })
            .populate('creator', 'username')
            .populate('leader', 'username')
            .lean();

        const projectIsMember = await projectRoleModel
            .find({ user_id: newMongoId(auth.id) })
            .populate({
                path: 'project_id',
                select: 'code name creator leader rank category start_date end_date status',
                populate: [
                    { path: 'leader', select: 'username' },
                    { path: 'creator', select: 'username' }
                ]
            })
            .populate('user_id', 'username')
            .lean();
        const projects = [];
        projectsIsLeader.forEach(project => {
            projects.push({
                ...project,
                caller_role_in_project: 'pm'
            });
        });

        projectIsMember.forEach(project => {
            projects.push({
                ...project.project_id,
                caller_role_in_project: 'user'
            });
        });

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