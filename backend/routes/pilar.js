/**
 * routes/pilar.js
 * Route donatur tetap Pilar Kebaikan
 */

const router = require('express').Router();
const pilarController = require('../controllers/pilarController');
const { authenticate, adminOnly, optionalAuth } = require('../middleware/auth');
const { pilarRules, validate } = require('../middleware/validator');

// POST /api/pilar (opsional auth)
router.post('/', optionalAuth, pilarRules, validate, pilarController.create);

// GET /api/pilar (admin)
router.get('/', authenticate, adminOnly, pilarController.getAll);

// DELETE /api/pilar/:id (admin)
router.delete('/:id', authenticate, adminOnly, pilarController.delete);

module.exports = router;
