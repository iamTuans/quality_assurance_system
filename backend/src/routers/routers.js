const express = require('express');
const router = express.Router();

// Importing routers
const auth_router = require('./auth');
const admin_router = require('./admin');
const pm_router = require('./pm');
const general_router = require('./general');

router.use('/auth', auth_router);
router.use('/admin', admin_router);
router.use('/pm', pm_router);
router.use('/general', general_router);

router.get('/', (_req, res) => {
    return res.status(200).send({
        message: 'hello!'
    });
});

router.get('*', (req, res) => {
    return res.status(404).send({
        message: 'Not found!'
    });
})

router.post('*', (req, res) => {
    return res.status(404).send({
        message: 'Not found!'
    });
})

module.exports = router;