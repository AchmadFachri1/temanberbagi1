/**
 * models/PilarDonatur.js
 * Schema donatur tetap Pilar Kebaikan — pendaftaran donatur bulanan
 * ─────────────────────────────────────────────────────────────
 * Relasi: user → ref 'User' (opsional)
 */

const mongoose = require('mongoose');

const pilarDonaturSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    nama: { type: String, required: [true, 'Nama wajib diisi'], trim: true },
    email: { type: String, required: [true, 'Email wajib diisi'], trim: true },
    nominal: {
      type: Number,
      required: [true, 'Nominal wajib diisi'],
      min: [10000, 'Nominal minimal Rp 10.000'],
    },
    aktif: { type: Boolean, default: true },
    bulan_aktif: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    collection: 'pilardonatur',
  }
);

module.exports = mongoose.model('PilarDonatur', pilarDonaturSchema);
