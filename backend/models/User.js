/**
 * models/User.js
 * Schema pengguna — menyimpan data akun, profil, dan autentikasi
 * ─────────────────────────────────────────────────────────────
 * Password di-hash menggunakan crypto.scrypt (KDF bawaan Node.js),
 * sehingga tidak butuh dependency eksternal dan hash dapat diverifikasi
 * langsung dari data hasil import (mongoimport).
 *
 * Format hash tersimpan: "scrypt$<saltHex>$<hashHex>"
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

/* ─── Helper hashing (scrypt) ──────────────────────────────── */
function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(plain, stored) {
  try {
    const [scheme, salt, hash] = stored.split('$');
    if (scheme !== 'scrypt' || !salt || !hash) return false;
    const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
    const a = Buffer.from(derived, 'hex');
    const b = Buffer.from(hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Nama pengguna wajib diisi'],
      unique: true,
      trim: true,
      minlength: [2, 'Nama pengguna minimal 2 karakter'],
      maxlength: [50, 'Nama pengguna maksimal 50 karakter'],
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email tidak valid'],
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
    },
    name: { type: String, trim: true },
    tgl_lahir: { type: Date, default: null },
    telepon: { type: String, default: '' },
    alamat: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

/* ─── Hash password sebelum simpan (jika belum di-hash) ────── */
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  // Jika sudah berformat scrypt$..., jangan hash ulang
  if (typeof this.password === 'string' && this.password.startsWith('scrypt$')) {
    return next();
  }
  this.password = hashPassword(this.password);
  next();
});

/* ─── Instance methods ─────────────────────────────────────── */
userSchema.methods.comparePassword = function (candidate) {
  return verifyPassword(candidate, this.password);
};

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Ekspor helper agar bisa dipakai seeder/import
userSchema.statics.hashPassword = hashPassword;
userSchema.statics.verifyPassword = verifyPassword;

module.exports = mongoose.model('User', userSchema);
