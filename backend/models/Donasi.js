/**
 * models/Donasi.js
 * Schema program donasi — data program penggalangan dana
 */

const mongoose = require('mongoose');

const donasiSchema = new mongoose.Schema(
  {
    img: { type: String, default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80' },
    title: {
      type: String,
      required: [true, 'Judul program wajib diisi'],
      trim: true,
    },
    deskripsi: { type: String, default: '' },
    konten: { type: String, default: '' },
    hari: { type: Number, default: 30 },
    jumlah: { type: Number, default: 0 },
    target: { type: Number, default: 500000 },
    deadline: { type: Date, default: null },
    fitur: {
      type: String,
      enum: ['donasi', 'kewajiban', 'derma', 'pilar-kebaikan'],
      default: 'donasi',
    },
    verified: { type: Boolean, default: false },
    bank: { type: String, default: null },
    no_rekening: { type: String, default: null },
    nama_rekening: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: 'donasi',
  }
);

module.exports = mongoose.model('Donasi', donasiSchema);
