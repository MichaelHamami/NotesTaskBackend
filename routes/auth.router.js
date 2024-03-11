const express = require('express');
const AuthController = require('../controllers/auth.controller');
const authControllerInstance = new AuthController();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { fingerPrint } = req.body;
    console.log('login called with ', fingerPrint);
    if (!fingerPrint) return res.status(400).send('FingerPrint is required');
    const token = await authControllerInstance.login(fingerPrint);
    res.cookie('token', token, { httpOnly: true });
    return res.json({ success: true, authToken: token });
  } catch (error) {
    console.log('error', error);
    return res.status(400).send(error.message);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { fingerPrint } = req.body;
    console.log('signup called with ', fingerPrint);
    if (!fingerPrint) return res.status(400).send('FingerPrint is required');
    const token = await authControllerInstance.signup(fingerPrint);
    res.cookie('token', token, { httpOnly: true });

    return res.json({ success: true, authToken: token });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
