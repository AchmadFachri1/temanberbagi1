/**
 * app.js
 * ─────────────────────────────────────────────────────────────
 * Konfigurasi Express Application
 *
 * Materi yang diimplementasikan:
 *   4. RESTful API menggunakan Express.js
 *   5. Middleware pada Express.js
 *   6. Integrasi Database menggunakan ORM (Sequelize)
 *   7. CRUD Data
 *   8. Integrasi Frontend dan Backend melalui API
 *   9. Autentikasi pengguna menggunakan JWT
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const donasiRoutes = require('./routes/donasi');
const transaksiRoutes = require('./routes/transaksi');
const kontakRoutes = require('./routes/kontak');
const pilarRoutes = require('./routes/pilar');
const userRoutes = require('./routes/user');

const app = express();

/* ─── Middleware Global ───────────────────────────────────── */

// CORS — izinkan frontend mengakses API
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger (hanya di development)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve frontend sebagai static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ─── API Routes ─────────────────────────────────────────── */
app.use('/api/auth', authRoutes);
app.use('/api/donasi', donasiRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/pilar', pilarRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Teman Berbagi API berjalan dengan baik!',
    timestamp: new Date().toISOString(),
  });
});

/* ─── Fallback: serve frontend untuk SPA routing ─────────── */
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

/* ─── Error Handling ─────────────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

module.exports = app;
