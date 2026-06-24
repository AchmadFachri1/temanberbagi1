/**
 * middleware/validator.js
 * ─────────────────────────────────────────────────────────────
 * Middleware validasi input request menggunakan express-validator
 * Materi: Middleware pada Express.js
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware: Jalankan hasil validasi dan kembalikan error jika ada
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

// ─── Aturan validasi per fitur ──────────────────────────────

const registerRules = [
  body('username')
    .trim().notEmpty().withMessage('Nama pengguna wajib diisi')
    .isLength({ min: 2, max: 50 }).withMessage('Nama pengguna 2-50 karakter'),
  body('email')
    .trim().isEmail().withMessage('Email tidak valid'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

const loginRules = [
  body('login')
    .trim().notEmpty().withMessage('Username atau email wajib diisi'),
  body('password')
    .notEmpty().withMessage('Password wajib diisi'),
];

const donasiRules = [
  body('title')
    .trim().notEmpty().withMessage('Judul program wajib diisi'),
];

const transaksiRules = [
  body('nama')
    .trim().notEmpty().withMessage('Nama donatur wajib diisi'),
  body('program')
    .trim().notEmpty().withMessage('Nama program wajib diisi'),
  body('jumlah')
    .isFloat({ min: 1000 }).withMessage('Jumlah minimal Rp 1.000'),
];

const kontakRules = [
  body('nama')
    .trim().notEmpty().withMessage('Nama wajib diisi'),
  body('email')
    .trim().isEmail().withMessage('Email tidak valid'),
  body('pesan')
    .trim().notEmpty().withMessage('Pesan wajib diisi'),
];

const pilarRules = [
  body('nama')
    .trim().notEmpty().withMessage('Nama wajib diisi'),
  body('email')
    .trim().isEmail().withMessage('Email tidak valid'),
  body('nominal')
    .isFloat({ min: 10000 }).withMessage('Nominal minimal Rp 10.000'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  donasiRules,
  transaksiRules,
  kontakRules,
  pilarRules,
};
