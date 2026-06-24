/**
 * config/database.js
 * Koneksi database MongoDB menggunakan Mongoose ODM
 * ─────────────────────────────────────────────────────────────
 * Materi: Integrasi Database menggunakan ORM/ODM (Mongoose)
 *
 * FIX: Mengatasi error "querySrv ECONNREFUSED" pada MongoDB Atlas
 *      dengan mengatur DNS resolver ke Google DNS (8.8.8.8)
 *      sebelum melakukan koneksi.
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const dns = require('dns');

// ── FIX DNS: Paksa pakai Google DNS agar SRV lookup Atlas berhasil ──
// Banyak ISP (terutama di Indonesia) tidak mendukung SRV record,
// sehingga mongodb+srv:// gagal. Baris ini menyelesaikan masalah itu.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teman_berbagi';

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Opsi default Mongoose v7+ sudah aman; tidak perlu flag tambahan
    });
    console.log(`✅ MongoDB terhubung: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ Gagal terhubung ke MongoDB:', error.message);

    // Berikan petunjuk tambahan jika error DNS
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.error('');
      console.error('💡 Tips: Error ini biasanya karena DNS ISP tidak support SRV record.');
      console.error('   Solusi:');
      console.error('   1. Pastikan file database.js sudah menggunakan dns.setServers()');
      console.error('   2. Atau ganti DNS komputer ke 8.8.8.8 (Google DNS)');
      console.error('   3. Atau gunakan connection string mongodb:// (non-SRV) dari Atlas');
      console.error('');
    }

    throw error;
  }
}

module.exports = { connectDB, mongoose, MONGO_URI };