/**
 * middleware/errorHandler.js
 * ─────────────────────────────────────────────────────────────
 * Penanganan error global (versi MongoDB/Mongoose)
 * Materi: Middleware pada Express.js
 */

const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: messages,
    });
  }

  // Mongoose duplicate key (unique index)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field} sudah terdaftar.`,
    });
  }

  // Mongoose cast error (ID tidak valid)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID tidak valid.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server.',
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukan.`,
  });
};

module.exports = { errorHandler, notFound };
