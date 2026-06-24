/**
 * models/Kontak.js
 * Schema pesan kontak — pesan dari form kontak
 */

const mongoose = require('mongoose');

const kontakSchema = new mongoose.Schema(
  {
    nama: { type: String, required: [true, 'Nama wajib diisi'], trim: true },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email tidak valid'],
    },
    subjek: { type: String, default: null },
    pesan: { type: String, required: [true, 'Pesan wajib diisi'] },
    dibaca: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'kontak',
  }
);

module.exports = mongoose.model('Kontak', kontakSchema);
