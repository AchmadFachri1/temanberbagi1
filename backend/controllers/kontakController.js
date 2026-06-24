/**
 * controllers/kontakController.js  (MongoDB/Mongoose)
 */

const { Kontak } = require('../models');

exports.create = async (req, res, next) => {
  try {
    const { nama, email, subjek, pesan } = req.body;
    const kontak = await Kontak.create({ nama, email, subjek, pesan });
    res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim! Kami akan segera merespons.',
      data: kontak,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const kontak = await Kontak.find().sort({ createdAt: -1 });
    res.json({ success: true, data: kontak, total: kontak.length });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const kontak = await Kontak.findByIdAndUpdate(
      req.params.id, { dibaca: true }, { new: true }
    );
    if (!kontak) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }
    res.json({ success: true, data: kontak });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const kontak = await Kontak.findByIdAndDelete(req.params.id);
    if (!kontak) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};
