import express from 'express';

import Controller from '../controllers/auth.controllers.js';
const router = express.Router();

router.post('/login', Controller.login);
router.get('/logout', Controller.logout);

export default router;