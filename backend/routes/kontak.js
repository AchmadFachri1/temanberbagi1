/**
 * routes/kontak.js
 * Route pesan kontak
 */

const router = require('express').Router();
const kontakController = require('../controllers/kontakController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { kontakRules, validate } = require('../middleware/validator');

// POST /api/kontak (publik)
router.post('/', kontakRules, validate, kontakController.create);

// GET /api/kontak (admin)
router.get('/', authenticate, adminOnly, kontakController.getAll);

// GET /api/kontak/:id (admin)
router.get('/:id', authenticate, adminOnly, kontakController.getById);

// DELETE /api/kontak/:id (admin)
router.delete('/:id', authenticate, adminOnly, kontakController.delete);

module.exports = router;
