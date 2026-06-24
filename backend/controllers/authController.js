/**
 * controllers/authController.js  (MongoDB/Mongoose)
 * Registrasi, login, profil pengguna
 * Materi: Autentikasi JWT + CRUD Data
 */

const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

/** POST /api/auth/register */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, tgl_lahir } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ success: false, message: 'Username sudah terdaftar.' });
    }

    const user = await User.create({
      username,
      email,
      password,
      name: username,
      tgl_lahir: tgl_lahir || null,
    });

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil!',
      data: { user: user.toSafeJSON(), token },
    });
  } catch (error) {
    next(error);
  }
};

/** POST /api/auth/login */
exports.login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: login }, { email: String(login).toLowerCase() }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.',
      });
    }

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password salah! Silakan coba lagi.',
      });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.username}!`,
      data: { user: user.toSafeJSON(), token },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/auth/me */
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user.toSafeJSON() });
};

/** PUT /api/auth/profile */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, telepon, alamat, tgl_lahir } = req.body;
    const user = req.user;
    if (name !== undefined) user.name = name;
    if (telepon !== undefined) user.telepon = telepon;
    if (alamat !== undefined) user.alamat = alamat;
    if (tgl_lahir !== undefined) user.tgl_lahir = tgl_lahir;
    await user.save();

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: user.toSafeJSON(),
    });
  } catch (error) {
    next(error);
  }
};
