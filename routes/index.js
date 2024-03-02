const express = require('express');
const noteRoutes = require('./note.router');
const taskRoutes = require('./task.router');


const router = express.Router();


router.use('/note', noteRoutes);
router.use('/task',taskRoutes);

module.exports = router;