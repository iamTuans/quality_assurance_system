//Import  modules
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { verifyToken } = require('./src/utils/utils');
const ROLE = require('./src/constants/ROLE');
const projectModel = require('./src/models/project.model');
const projectRoleModel = require('./src/models/projectRole.model');
const fs = require('fs');
const moment = require('moment');

//Import routers
const routers = require('./src/routers/routers');
const fileModel = require('./src/models/file.model');

dotenv.config();

const app = express();

app.use(cors({
    origin: '*'
}));

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(database => {
        console.log(`Database ${database.connection.name} connected on ${database.connection.host}:${database.connection.port}`);
    })
    .catch(err => {
        console.error(err);
    })

// Enable parsing json data
app.use(express.json({
    limit: '10mb'
}));

// Enable serving static files
const assetsPath = path.join(__dirname, './uploads');
app.use('/assets', express.static(assetsPath));
// console.log(path.join(__dirname));

// Multer configuration
const storage = multer.diskStorage({
    destination: (_req, file, res) => {
        if (file.mimetype.startsWith('image/')) {
            return res(null, path.join(__dirname, './uploads/images'));
        } else {
            return res(null, path.join(__dirname, './uploads/documents'));
        }
    },
    filename: (_req, file, res) => {
        const ext = path.extname(file.originalname);
        return res(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
// Upload Router
app.post('/api/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        const auth = req.auth;
        if (auth.role == ROLE.UNAUTHORIZED) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }

        const {
            project_code,
            name,
            version,
            create_date,
            description,
            component,
            category,
            module
        } = req.body;

        const foundProject = await projectModel
            .findOne({ code: project_code });
        if (!foundProject) {
            throw new Error('Project not found!');
        }

        const projectRole = await projectRoleModel.findOne({
            user_id: auth.id, project_id: foundProject._id
        });
        
        if(!(projectRole || foundProject.leader == auth.id || auth.role == ROLE.ADMIN)) {
            return res.status(403).send({
                message: 'Forbidden!'
            });
        }

        let file_type = 'documents';
        if (req.file.mimetype.startsWith('image/')) {
            file_type = 'images';
        }
        const server_file_path = `/assets/${file_type}/${req.file.filename}`;
        const newFile = new fileModel({
            project: foundProject._id,
            name,
            version,
            create_date: moment.utc(create_date, 'DD-MM-YYYY').toDate(),
            description,
            component,
            category,
            module,
            creator: auth.id,
            server_file_path
        });
        await newFile.save();

        return res.status(200).send({
            message: 'File(s) uploaded successfully',
            file: req.file
        });
    } catch (error) {
        if (req.file) {
            const filePath = path.join(__dirname, `uploads/${req.file.mimetype.startsWith('image/') ? 'images':'documents'}`, req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        }
        return res.status(500).send({ message: 'Error uploading file', error: error.message });
    }
});

app.use('/api', routers);

app.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}!`)
});