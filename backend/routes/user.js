/**
 * routes/user.js
 * Route manajemen user oleh admin
 */

const router = require('express').Router();
const userController = require('../controllers/userController');
const { authenticate, adminOnly } = require('../middleware/auth');

// GET /api/users (admin)
router.get('/', authenticate, adminOnly, userController.getAll);

// GET /api/users/:id (admin)
router.get('/:id', authenticate, adminOnly, userController.getById);

// DELETE /api/users/:id (admin)
router.delete('/:id', authenticate, adminOnly, userController.delete);

module.exports = router;
