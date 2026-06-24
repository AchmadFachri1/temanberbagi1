/**
 * controllers/transaksiController.js  (MongoDB/Mongoose)
 * CRUD transaksi donasi + verifikasi + statistik
 * Materi: CRUD Data + RESTful API
 */

const { Transaksi, Donasi } = require('../models');

/** GET /api/transaksi */
exports.getAll = async (req, res, next) => {
  try {
    const { status, kategori } = req.query;
    const filter = {};
    if (req.user.role !== 'admin') filter.user = req.user._id;
    if (status) filter.status = status;
    if (kategori) filter.kategori = kategori;

    const transaksi = await Transaksi.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'username email')
      .populate('donasi', 'title img');

    res.json({ success: true, data: transaksi, total: transaksi.length });
  } catch (error) {
    next(error);
  }
};

/** GET /api/transaksi/stats (admin) */
exports.getStats = async (req, res, next) => {
  try {
    const total = await Transaksi.countDocuments();
    const pending = await Transaksi.countDocuments({ status: 'pending' });
    const verified = await Transaksi.countDocuments({ status: 'verified' });
    const rejected = await Transaksi.countDocuments({ status: 'rejected' });

    const agg = await Transaksi.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$jumlah' } } },
    ]);
    const totalDonasi = agg.length ? agg[0].total : 0;

    res.json({
      success: true,
      data: { total, pending, verified, rejected, totalDonasi },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/transaksi/:id */
exports.getById = async (req, res, next) => {
  try {
    const transaksi = await Transaksi.findById(req.params.id)
      .populate('user', 'username email')
      .populate('donasi', 'title img');
    if (!transaksi) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }
    if (req.user.role !== 'admin' && String(transaksi.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }
    res.json({ success: true, data: transaksi });
  } catch (error) {
    next(error);
  }
};

/** POST /api/transaksi */
exports.create = async (req, res, next) => {
  try {
    const {
      donasi_id, nama, email, program, jumlah,
      metode, bukti, bukti_foto, kategori, tanggal,
    } = req.body;

    const transaksi = await Transaksi.create({
      user: req.user ? req.user._id : null,
      donasi: donasi_id || null,
      nama: nama || (req.user ? req.user.username : 'Anonim'),
      email: email || (req.user ? req.user.email : null),
      program,
      jumlah,
      metode: metode || 'Transfer',
      bukti: bukti || false,
      bukti_foto: bukti_foto || null,
      kategori: kategori || 'donasi',
      tanggal: tanggal || Date.now(),
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Donasi berhasil dikirim! Menunggu verifikasi.',
      data: transaksi,
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH /api/transaksi/:id/verify (admin) */
exports.verify = async (req, res, next) => {
  try {
    const transaksi = await Transaksi.findById(req.params.id);
    if (!transaksi) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }
    transaksi.status = 'verified';
    await transaksi.save();

    // Tambah jumlah terkumpul pada program terkait
    if (transaksi.donasi) {
      await Donasi.findByIdAndUpdate(transaksi.donasi, { $inc: { jumlah: transaksi.jumlah } });
    }

    res.json({
      success: true,
      message: `Donasi dari ${transaksi.nama} berhasil diverifikasi.`,
      data: transaksi,
    });
  } catch (error) {
    next(error);
  }
};

/** PATCH /api/transaksi/:id/reject (admin) */
exports.reject = async (req, res, next) => {
  try {
    const transaksi = await Transaksi.findByIdAndUpdate(
      req.params.id, { status: 'rejected' }, { new: true }
    );
    if (!transaksi) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }
    res.json({
      success: true,
      message: `Donasi dari ${transaksi.nama} ditolak.`,
      data: transaksi,
    });
  } catch (error) {
    next(error);
  }
};
