/**
 * seeders/seed.js  (MongoDB/Mongoose)
 * ─────────────────────────────────────────────────────────────
 * Mengisi database dengan data awal menggunakan model Mongoose.
 * Berbeda dari mongodb/import.js, seeder ini MEMBUAT ULANG data
 * dari nol (drop + create) dan meng-hash password lewat model.
 *
 * Jalankan: npm run seed
 * ─────────────────────────────────────────────────────────────
 */

require('dotenv').config();

const { connectDB, mongoose } = require('../config/database');
const { User, Donasi, Transaksi, Kontak, PilarDonatur } = require('../models');

async function seed() {
  try {
    await connectDB();

    // Bersihkan koleksi
    await Promise.all([
      User.deleteMany({}),
      Donasi.deleteMany({}),
      Transaksi.deleteMany({}),
      Kontak.deleteMany({}),
      PilarDonatur.deleteMany({}),
    ]);
    console.log('✅ Koleksi dibersihkan');

    // ── Users ──
    const admin = await User.create({
      username: 'admin', email: 'admin@temanberbagi.id',
      password: 'admin123', name: 'Administrator', role: 'admin',
    });
    const ahmad = await User.create({
      username: 'ahmad', email: 'ahmad@gmail.com',
      password: 'user123', name: 'Ahmad Fauzi', tgl_lahir: '1995-03-15',
    });
    const siti = await User.create({
      username: 'siti', email: 'siti@gmail.com',
      password: 'user123', name: 'Siti Rahma', tgl_lahir: '1998-07-22',
    });
    console.log('✅ User dibuat (admin/admin123, ahmad & siti /user123)');

    // ── Donasi ──
    const donasi = await Donasi.insertMany([
      { img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', title: 'Mari membantu keluarga kita yang berada di sumatra', deskripsi: 'Dengan berbagi, kita bisa membantu mereka yang membutuhkan...', hari: 4, jumlah: 295000, target: 500000, fitur: 'donasi', verified: true, bank: 'BCA', no_rekening: '1234567890', nama_rekening: 'Teman Berbagi' },
      { img: 'https://images.unsplash.com/photo-1609234334335-5f6d3a5b3d9a?w=600&q=80', title: 'Bantu mereka agar dapat melaksanakan ibadah dengan hikmat', deskripsi: 'Dengan berbagi, kita bisa membantu...', hari: 4, jumlah: 295000, target: 500000, fitur: 'donasi', verified: true, bank: 'BRI', no_rekening: '0987654321', nama_rekening: 'Teman Berbagi' },
      { img: 'https://images.unsplash.com/photo-1587134160474-2f1b940a5a0d?w=600&q=80', title: 'Pengadaan mobile ambulance gratis bagi warga pelosok', deskripsi: 'Pengadaan ambulance untuk masyarakat di daerah terpencil...', hari: 20, jumlah: 295000, target: 500000, fitur: 'donasi', verified: true, bank: 'Mandiri', no_rekening: '1122334455', nama_rekening: 'Teman Berbagi' },
      { img: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80', title: 'Mari membantu keluarga kita yang berada di sumatra', deskripsi: 'Bantuan untuk keluarga terdampak bencana...', hari: 4, jumlah: 295000, target: 500000, fitur: 'donasi', verified: true },
      { img: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=600&q=80', title: 'Saat ini Ibu suri memasuki stadium 3 kanker yang di derita', deskripsi: 'Bantuan biaya pengobatan...', hari: 4, jumlah: 295000, target: 500000, fitur: 'donasi', verified: true },
      { img: 'https://images.unsplash.com/photo-1588859519748-d56d71e67e03?w=600&q=80', title: 'Pengadaan mobile ambulance gratis bagi warga pelosok', deskripsi: 'Ambulance gratis untuk warga pelosok...', hari: 20, jumlah: 295000, target: 500000, fitur: 'donasi', verified: true },
      { img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', title: 'Mari sempurnakan Ramadan dengan membayar Zakat Fitrah', deskripsi: 'Program zakat fitrah Ramadan...', hari: 30, jumlah: 0, target: 500000, fitur: 'kewajiban', verified: false },
    ]);
    console.log(`✅ ${donasi.length} program donasi dibuat`);

    // ── Transaksi (relasi ke users & donasi) ──
    await Transaksi.insertMany([
      { user: ahmad._id, donasi: donasi[0]._id, nama: 'Ahmad Fauzi', email: 'ahmad.fauzi@gmail.com', program: 'Mari membantu keluarga di Sumatra', jumlah: 150000, tanggal: '2026-06-01', metode: 'Transfer BCA', bukti: true, status: 'pending', kategori: 'donasi' },
      { user: siti._id, donasi: donasi[1]._id, nama: 'Siti Rahma', email: 'siti.r@gmail.com', program: 'Bantu ibadah dengan hikmat', jumlah: 75000, tanggal: '2026-06-01', metode: 'Transfer BRI', bukti: true, status: 'pending', kategori: 'donasi' },
      { donasi: donasi[2]._id, nama: 'Budi Santoso', email: 'budisan@yahoo.com', program: 'Pengadaan ambulance warga pelosok', jumlah: 500000, tanggal: '2026-05-31', metode: 'Transfer Mandiri', bukti: true, status: 'verified', kategori: 'donasi' },
      { donasi: donasi[4]._id, nama: 'Dewi Lestari', email: 'dewi.l@hotmail.com', program: 'Saat ini Ibu suri stadium 3', jumlah: 200000, tanggal: '2026-05-31', metode: 'Transfer BCA', bukti: false, status: 'pending', kategori: 'donasi' },
      { donasi: donasi[0]._id, nama: 'Rizky Pratama', email: 'rizky.p@gmail.com', program: 'Mari membantu keluarga di Sumatra', jumlah: 100000, tanggal: '2026-05-30', metode: 'Transfer BNI', bukti: true, status: 'rejected', kategori: 'donasi' },
      { donasi: donasi[2]._id, nama: 'Nur Hidayah', email: 'nur.h@gmail.com', program: 'Pengadaan ambulance warga pelosok', jumlah: 250000, tanggal: '2026-05-30', metode: 'Transfer BRI', bukti: true, status: 'pending', kategori: 'donasi' },
      { donasi: donasi[1]._id, nama: 'Hasan Basri', email: 'hasan.b@gmail.com', program: 'Bantu ibadah dengan hikmat', jumlah: 50000, tanggal: '2026-05-29', metode: 'Transfer Mandiri', bukti: true, status: 'verified', kategori: 'donasi' },
    ]);
    console.log('✅ Transaksi dibuat');

    // ── Kontak ──
    await Kontak.create({ nama: 'Andi Wijaya', email: 'andi@gmail.com', subjek: 'Pertanyaan Donasi', pesan: 'Bagaimana cara menyalurkan donasi untuk program ambulance?' });

    // ── Pilar Donatur ──
    await PilarDonatur.insertMany([
      { user: ahmad._id, nama: 'Ahmad R.', email: 'ahmad@gmail.com', nominal: 100000, bulan_aktif: 15 },
      { user: siti._id, nama: 'Siti N.', email: 'siti@gmail.com', nominal: 50000, bulan_aktif: 17 },
      { nama: 'Hamba Allah', email: 'anon@email.com', nominal: 200000, bulan_aktif: 2 },
      { nama: 'Yusuf P.', email: 'yusuf@gmail.com', nominal: 150000, bulan_aktif: 20 },
    ]);
    console.log('✅ Kontak & Pilar donatur dibuat');

    console.log('\n🎉 Seed selesai!');
    console.log('   Login admin : admin@temanberbagi.id / admin123');
    console.log('   Login user  : ahmad@gmail.com / user123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed gagal:', error);
    process.exit(1);
  }
}

seed();
