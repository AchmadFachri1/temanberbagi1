/**
 * routes/donasi.js
 * Route program donasi: CRUD + pencarian + publikasi
 */

const router = require('express').Router();
const donasiController = require('../controllers/donasiController');
const { authenticate, adminOnly } = require('../middleware/auth');
const { donasiRules, validate } = require('../middleware/validator');

// GET /api/donasi/search?q=keyword (publik)
router.get('/search', donasiController.search);

// GET /api/donasi (publik)
router.get('/', donasiController.getAll);

// GET /api/donasi/:id (publik)
router.get('/:id', donasiController.getById);

// POST /api/donasi (admin only)
router.post('/', authenticate, adminOnly, donasiRules, validate, donasiController.create);

// PUT /api/donasi/:id (admin only)
router.put('/:id', authenticate, adminOnly, donasiController.update);

// DELETE /api/donasi/:id (admin only)
router.delete('/:id', authenticate, adminOnly, donasiController.delete);

// PATCH /api/donasi/:id/publish (admin only)
router.patch('/:id/publish', authenticate, adminOnly, donasiController.publish);

module.exports = router;
