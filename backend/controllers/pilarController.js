/**
 * controllers/pilarController.js  (MongoDB/Mongoose)
 */

const { PilarDonatur } = require('../models');

exports.create = async (req, res, next) => {
  try {
    const { nama, email, nominal } = req.body;
    const pilar = await PilarDonatur.create({
      user: req.user ? req.user._id : null,
      nama, email, nominal,
    });
    res.status(201).json({
      success: true,
      message: 'Pendaftaran donatur tetap berhasil!',
      data: pilar,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const pilar = await PilarDonatur.find().sort({ createdAt: -1 });
    const aktif = pilar.filter((p) => p.aktif);
    const totalDonatur = aktif.length;
    const totalNominal = aktif.reduce((s, p) => s + p.nominal, 0);
    res.json({ success: true, data: pilar, stats: { totalDonatur, totalNominal } });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const pilar = await PilarDonatur.findByIdAndUpdate(
      req.params.id, { aktif: false }, { new: true }
    );
    if (!pilar) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Donatur tetap berhasil dinonaktifkan.' });
  } catch (error) {
    next(error);
  }
};
