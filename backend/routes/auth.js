/**
 * routes/auth.js
 * Route autentikasi: register, login, profil
 */

const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerRules, loginRules, validate } = require('../middleware/validator');

// POST /api/auth/register
router.post('/register', registerRules, validate, authController.register);

// POST /api/auth/login
router.post('/login', loginRules, validate, authController.login);

// GET /api/auth/me (protected)
router.get('/me', authenticate, authController.getMe);

// PUT /api/auth/profile (protected)
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
