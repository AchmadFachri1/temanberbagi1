/**
 * routes/transaksi.js
 * Route transaksi donasi: CRUD + verifikasi + statistik
 */

const router = require('express').Router();
const transaksiController = require('../controllers/transaksiController');
const { authenticate, adminOnly, optionalAuth } = require('../middleware/auth');
const { transaksiRules, validate } = require('../middleware/validator');

// GET /api/transaksi/stats (admin)
router.get('/stats', authenticate, adminOnly, transaksiController.getStats);

// GET /api/transaksi (protected)
router.get('/', authenticate, transaksiController.getAll);

// GET /api/transaksi/:id (protected)
router.get('/:id', authenticate, transaksiController.getById);

// POST /api/transaksi (opsional auth — bisa donasi tanpa login)
router.post('/', optionalAuth, transaksiRules, validate, transaksiController.create);

// PATCH /api/transaksi/:id/verify (admin)
router.patch('/:id/verify', authenticate, adminOnly, transaksiController.verify);

// PATCH /api/transaksi/:id/reject (admin)
router.patch('/:id/reject', authenticate, adminOnly, transaksiController.reject);

module.exports = router;
