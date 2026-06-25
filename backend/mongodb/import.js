/**
 * mongodb/import.js
 * ─────────────────────────────────────────────────────────────
 * Importer database TANPA perlu `mongoimport`/MongoDB Tools.
 * Membaca file JSON di ./data dan memasukkannya ke MongoDB
 * melalui driver Mongoose (dependency yang sudah ada di proyek).
 *
 * Menjaga _id dan relasi tetap konsisten, serta meng-upsert
 * sehingga aman dijalankan berulang kali.
 *
 * Cara pakai:
 *   node mongodb/import.js
 *   MONGO_URI=mongodb://127.0.0.1:27017/teman_berbagi node mongodb/import.js
 * ─────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teman_berbagi';
const DATA_DIR = path.join(__dirname, 'data');

const { Types } = mongoose;

/** Konversi Extended JSON ($oid, $date) → tipe asli BSON */
function revive(value) {
  if (Array.isArray(value)) return value.map(revive);
  if (value && typeof value === 'object') {
    if ('$oid' in value) return new Types.ObjectId(value.$oid);
    if ('$date' in value) return new Date(value.$date);
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = revive(v);
    return out;
  }
  return value;
}

const COLLECTIONS = ['users', 'donasi', 'transaksi', 'kontak', 'pilardonatur'];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Terhubung: ${MONGO_URI}`);
    const db = mongoose.connection.db;

    for (const coll of COLLECTIONS) {
      const file = path.join(DATA_DIR, `${coll}.json`);
      if (!fs.existsSync(file)) { console.warn(`  ⚠ lewati ${coll} (file tidak ada)`); continue; }
      const docs = revive(JSON.parse(fs.readFileSync(file, 'utf8')));
      const collection = db.collection(coll);

      // Upsert per dokumen agar idempotent
      const ops = docs.map((doc) => ({
        replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true },
      }));
      if (ops.length) await collection.bulkWrite(ops);
      console.log(`  → ${coll}: ${docs.length} dokumen di-import`);
    }

    console.log('\n✅ Import selesai!');
    console.log('   Login admin : admin@temanberbagi.id / admin123');
    console.log('   Login user  : ahmad@gmail.com / user123');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Import gagal:', err.message);
    process.exit(1);
  }
}

run();
