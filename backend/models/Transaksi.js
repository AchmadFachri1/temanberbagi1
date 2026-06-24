/**
 * models/Transaksi.js
 * Schema transaksi donasi — setiap pembayaran dari donatur
 * ─────────────────────────────────────────────────────────────
 * Relasi:
 *   user  → ref 'User'   (donatur yang login, opsional)
 *   donasi → ref 'Donasi' (program yang didonasikan)
 */

const mongoose = require('mongoose');

const transaksiSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    donasi: { type: mongoose.Schema.Types.ObjectId, ref: 'Donasi', default: null },
    nama: {
      type: String,
      required: [true, 'Nama donatur wajib diisi'],
      trim: true,
    },
    email: { type: String, default: null, trim: true },
    program: {
      type: String,
      required: [true, 'Nama program wajib diisi'],
    },
    jumlah: {
      type: Number,
      required: [true, 'Jumlah wajib diisi'],
      min: [1000, 'Jumlah minimal Rp 1.000'],
    },
    metode: { type: String, default: 'Transfer' },
    bukti: { type: Boolean, default: false },
    bukti_foto: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    kategori: {
      type: String,
      enum: ['donasi', 'zakat', 'persepuhan', 'stipendium', 'derma', 'pilar'],
      default: 'donasi',
    },
    tanggal: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'transaksi',
  }
);

module.exports = mongoose.model('Transaksi', transaksiSchema);
