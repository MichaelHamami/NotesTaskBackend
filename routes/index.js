const express = require('express');
const noteRoutes = require('./note.router');
const taskRoutes = require('./task.router');
const authRoutes = require('./auth.router');

const router = express.Router();


router.use('/note', noteRoutes);
router.use('/task',taskRoutes);
router.use('/auth',authRoutes);

module.exports = router;