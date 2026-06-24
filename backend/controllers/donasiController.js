/**
 * controllers/donasiController.js  (MongoDB/Mongoose)
 * CRUD program donasi
 * Materi: RESTful API + CRUD Data
 */

const { Donasi, Transaksi } = require('../models');

/** GET /api/donasi */
exports.getAll = async (req, res, next) => {
  try {
    const { fitur, verified } = req.query;
    const filter = {};
    if (fitur) filter.fitur = fitur;
    if (verified !== undefined) filter.verified = verified === 'true';

    const donasi = await Donasi.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: donasi, total: donasi.length });
  } catch (error) {
    next(error);
  }
};

/** GET /api/donasi/search?q= */
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const donasi = await Donasi.find({
      title: { $regex: q, $options: 'i' },
      verified: true,
    }).limit(10);
    res.json({ success: true, data: donasi });
  } catch (error) {
    next(error);
  }
};

/** GET /api/donasi/:id
 *  Mengembalikan detail program + daftar DONATUR yang sudah TERVERIFIKASI
 *  (dipakai untuk menampilkan daftar "dermawan" di halaman detail).
 */
exports.getById = async (req, res, next) => {
  try {
    const donasi = await Donasi.findById(req.params.id);
    if (!donasi) {
      return res.status(404).json({ success: false, message: 'Program donasi tidak ditemukan.' });
    }
    // Hanya donatur dengan status 'verified' yang ditampilkan sebagai dermawan
    const donatur = await Transaksi.find({ donasi: donasi._id, status: 'verified' })
      .select('nama jumlah tanggal kategori metode')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { ...donasi.toObject(), donatur, transaksi: donatur } });
  } catch (error) {
    next(error);
  }
};

/** POST /api/donasi (admin) */
exports.create = async (req, res, next) => {
  try {
    const {
      title, deskripsi, konten, img, target, deadline,
      fitur, bank, no_rekening, nama_rekening, hari, verified,
    } = req.body;

    const donasi = await Donasi.create({
      title, deskripsi, konten,
      img: img || undefined,
      target: target || 500000,
      deadline: deadline || null,
      fitur: fitur || 'donasi',
      bank, no_rekening, nama_rekening,
      hari: hari || 30,
      verified: verified === true || verified === 'true',
    });

    res.status(201).json({ success: true, message: 'Program donasi berhasil dibuat!', data: donasi });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/donasi/:id (admin) */
exports.update = async (req, res, next) => {
  try {
    const allowed = ['title', 'deskripsi', 'konten', 'img', 'target', 'deadline', 'fitur', 'bank', 'no_rekening', 'nama_rekening', 'hari', 'verified'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const donasi = await Donasi.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    });
    if (!donasi) {
      return res.status(404).json({ success: false, message: 'Program donasi tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Program donasi berhasil diperbarui.', data: donasi });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/donasi/:id (admin) */
exports.delete = async (req, res, next) => {
  try {
    const donasi = await Donasi.findByIdAndDelete(req.params.id);
    if (!donasi) {
      return res.status(404).json({ success: false, message: 'Program donasi tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Program donasi berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

/** PATCH /api/donasi/:id/publish (admin) */
exports.publish = async (req, res, next) => {
  try {
    const donasi = await Donasi.findByIdAndUpdate(
      req.params.id, { verified: true }, { new: true }
    );
    if (!donasi) {
      return res.status(404).json({ success: false, message: 'Program donasi tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Program donasi berhasil dipublikasikan!', data: donasi });
  } catch (error) {
    next(error);
  }
};
