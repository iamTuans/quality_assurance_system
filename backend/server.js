//Import  modules
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const { verifyToken } = require('./src/utils/utils');
const ROLE = require('./src/constants/ROLE');
const projectModel = require('./src/models/project.model');

//Import routers
const routers = require('./src/routers/routers');

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

app.use('/api', routers);

app.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}!`)
});