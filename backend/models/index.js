/**
 * models/index.js
 * Registrasi semua model Mongoose
 * ─────────────────────────────────────────────────────────────
 * Relasi diwakili melalui referensi ObjectId (field 'ref') dan
 * di-resolve saat query menggunakan .populate().
 */

const { mongoose } = require('../config/database');
const User = require('./User');
const Donasi = require('./Donasi');
const Transaksi = require('./Transaksi');
const Kontak = require('./Kontak');
const PilarDonatur = require('./PilarDonatur');

module.exports = {
  mongoose,
  User,
  Donasi,
  Transaksi,
  Kontak,
  PilarDonatur,
};
