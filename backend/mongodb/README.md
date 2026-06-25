# Database MongoDB — Teman Berbagi (Siap Import)

Folder ini berisi **database MongoDB lengkap** untuk aplikasi Teman Berbagi: skema (Mongoose), relasi antar-collection, dan **data awal (seed) yang siap di-import** tanpa konfigurasi tambahan. Tersedia **3 cara import** — pilih salah satu sesuai tool yang Anda punya.

> Detail skema & relasi lengkap ada di **[`SCHEMA.md`](./SCHEMA.md)**.

```
mongodb/
├── data/                       # ← FILE DATABASE (Extended JSON, jsonArray)
│   ├── users.json              #    3 dokumen
│   ├── donasi.json             #    7 dokumen
│   ├── transaksi.json          #    7 dokumen (berelasi ke users & donasi)
│   ├── kontak.json             #    1 dokumen
│   ├── pilardonatur.json       #    4 dokumen (berelasi ke users)
│   └── teman_berbagi.full.json #    gabungan semua collection
├── teman_berbagi.mongosh.js    # ← skrip mongosh (insertMany)
├── import.sh                   # ← skrip mongoimport
├── import.js                   # ← importer Node (tanpa MongoDB Tools)
└── SCHEMA.md                   # dokumentasi skema & relasi
```

Semua `_id` memakai ObjectId tetap, jadi **relasi antar-collection tetap konsisten** setelah import. Password sudah di-hash (scrypt) sehingga **login langsung berfungsi**.

## Cara Import (pilih salah satu)

### Opsi 1 — `mongoimport` (MongoDB Database Tools)
```bash
cd mongodb
bash import.sh
# atau ke server lain:
MONGO_HOST=127.0.0.1 MONGO_PORT=27017 DB_NAME=teman_berbagi bash import.sh
```

### Opsi 2 — `mongosh`
```bash
mongosh "mongodb://127.0.0.1:27017/teman_berbagi" mongodb/teman_berbagi.mongosh.js
```

### Opsi 3 — Node.js (tanpa perlu MongoDB Tools/mongosh)
Membutuhkan dependency proyek (`mongoose`) yang sudah terpasang:
```bash
npm install
node mongodb/import.js
# atau: npm run import
```

### Verifikasi
```bash
mongosh "mongodb://127.0.0.1:27017/teman_berbagi" --eval "
  print('users:', db.users.countDocuments());
  print('donasi:', db.donasi.countDocuments());
  print('transaksi:', db.transaksi.countDocuments());
  printjson(db.transaksi.findOne());
"
```

## Akun Bawaan
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@temanberbagi.id` | `admin123` |
| User | `ahmad@gmail.com` | `user123` |
| User | `siti@gmail.com` | `user123` |

## Catatan
- **Format file**: MongoDB Extended JSON v2 (`{"$oid": ...}`, `{"$date": ...}`) — format resmi yang dipahami `mongoimport`.
- **Idempotent**: ketiga importer memakai upsert/drop, aman dijalankan berulang.
- **Nama collection** sesuai model Mongoose (`users`, `donasi`, `transaksi`, `kontak`, `pilardonatur`), jadi aplikasi langsung membacanya tanpa setting tambahan.
