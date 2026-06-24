# PANDUAN LENGKAP MENJALANKAN PROYEK — Teman Berbagi

Dokumen ini menjelaskan **semua yang perlu di-install** dan **aturan lengkap menjalankan kedua proyek** dari nol sampai aplikasi berjalan di browser.

Ada **2 proyek** yang fungsinya identik, hanya beda database:

| Proyek | Folder | Database | Cocok untuk |
|--------|--------|----------|-------------|
| **A — Versi SQL** | `teman-berbagi-sql/` | SQLite (Sequelize) | Paling mudah, **tanpa install database** |
| **B — Versi MongoDB** | `teman-berbagi-mongodb/` | MongoDB (Mongoose) | Jika tugas mewajibkan MongoDB |

> Pilih **salah satu** untuk dijalankan. Keduanya memakai frontend yang sama dan berjalan di `http://localhost:5000`. **Untuk pemula → mulai dari Proyek A.**

---

# BAGIAN 1 — SOFTWARE YANG WAJIB DI-INSTALL

## 1.1. Node.js (WAJIB untuk kedua proyek)

Node.js menjalankan backend dan sudah termasuk `npm` (package manager).

- **Versi**: Node.js **18 LTS atau 20 LTS** (disarankan 20).
- **Download**: <https://nodejs.org> → pilih versi **LTS**.

**Cara install:**
- **Windows**: jalankan installer `.msi`, klik Next sampai selesai (biarkan opsi default, termasuk "Add to PATH").
- **macOS**: jalankan installer `.pkg`, atau via Homebrew: `brew install node@20`
- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

**Verifikasi (buka Terminal / CMD / PowerShell):**
```bash
node -v      # harus muncul mis. v20.x.x
npm -v       # harus muncul mis. 10.x.x
```
Jika dua perintah di atas mengeluarkan nomor versi, Node.js siap.

## 1.2. Editor Kode (disarankan)
**Visual Studio Code** — <https://code.visualstudio.com>. Editor apa pun boleh, tetapi VS Code punya Terminal bawaan yang memudahkan (menu **Terminal → New Terminal**).

## 1.3. MongoDB (HANYA untuk Proyek B)

Lewati bagian ini jika hanya menjalankan Proyek A (SQL).

Pilih **salah satu** opsi:

### Opsi 1 — MongoDB lokal (di komputer sendiri)
- **Download**: MongoDB Community Server — <https://www.mongodb.com/try/download/community>
- **Windows**: jalankan installer `.msi`, pilih **"Install MongoDB as a Service"** (agar otomatis berjalan). Centang juga **MongoDB Compass** (GUI opsional).
- **macOS** (Homebrew):
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community@7.0
  brew services start mongodb-community@7.0
  ```
- **Linux (Ubuntu)**: ikuti panduan resmi <https://www.mongodb.com/docs/manual/administration/install-on-linux/>, lalu:
  ```bash
  sudo systemctl start mongod
  sudo systemctl enable mongod    # otomatis jalan saat boot
  ```

**Verifikasi MongoDB berjalan:**
```bash
mongosh --eval "db.runCommand({ ping: 1 })"
# jika muncul { ok: 1 } berarti MongoDB aktif di mongodb://127.0.0.1:27017
```

### Opsi 2 — MongoDB Atlas (cloud, tanpa install)
1. Daftar gratis di <https://www.mongodb.com/cloud/atlas>.
2. Buat **Free Cluster (M0)**.
3. Menu **Database Access** → buat user + password.
4. Menu **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0).
5. Klik **Connect → Drivers**, salin connection string, contoh:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/teman_berbagi`
6. Tempel string itu ke file `.env` proyek B pada baris `MONGO_URI=` (lihat Bagian 3).

### (Opsional) MongoDB Database Tools — untuk perintah `mongoimport`
Hanya diperlukan bila ingin import via `import.sh`. **Tidak wajib**, karena proyek B sudah menyediakan importer berbasis Node (`npm run import`).
- Download: <https://www.mongodb.com/try/download/database-tools>

---

# BAGIAN 2 — MENJALANKAN PROYEK A (VERSI SQL / SQLite)

**Tidak perlu install database apa pun.** SQLite berupa file otomatis.

### Langkah 2.1 — Buka folder proyek di Terminal
```bash
cd teman-berbagi-sql
```
> Tips: di VS Code, buka folder `teman-berbagi-sql`, lalu Terminal → New Terminal (otomatis sudah di folder yang benar).

### Langkah 2.2 — Install dependency (sekali saja)
```bash
npm install
```
Perintah ini membaca `package.json` dan mengunduh semua library (Express, Sequelize, sqlite3, JWT, dll.) ke folder `node_modules/`. Tunggu hingga selesai (1–3 menit).

### Langkah 2.3 — Isi data awal (seed)
```bash
npm run seed
```
Membuat file `backend/database.sqlite` dan mengisinya dengan akun + 7 program donasi + transaksi contoh.
Akun yang dibuat:
- **Admin** → email `admin@temanberbagi.id` · password `admin123`
- **User**  → email `ahmad@gmail.com` · password `user123`

### Langkah 2.4 — Jalankan server
```bash
npm start
```
Akan muncul:
```
✅ Database terhubung (SQLite)
🚀 Teman Berbagi API Server
   Backend  : http://localhost:5000/api
   Frontend : http://localhost:5000
```

### Langkah 2.5 — Buka aplikasi
Buka browser ke **<http://localhost:5000>**. Frontend lengkap akan tampil dan otomatis terhubung ke API.

### Langkah 2.6 — Menghentikan server
Tekan **Ctrl + C** di Terminal.

### (Opsional) Mode pengembangan & testing
```bash
npm run dev     # auto-restart saat kode diubah (nodemon)
npm test        # menjalankan unit test (Jest + Supertest)
```

---

# BAGIAN 3 — MENJALANKAN PROYEK B (VERSI MongoDB)

**Pastikan MongoDB sudah berjalan** (Bagian 1.3) sebelum mulai.

### Langkah 3.1 — Buka folder proyek
```bash
cd teman-berbagi-mongodb
```

### Langkah 3.2 — (Hanya jika pakai Atlas) atur koneksi
Buka file `.env`, ubah baris `MONGO_URI` menjadi connection string Atlas Anda:
```
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/teman_berbagi
```
Jika memakai MongoDB lokal, **biarkan apa adanya** (`mongodb://127.0.0.1:27017/teman_berbagi`).

### Langkah 3.3 — Install dependency (sekali saja)
```bash
npm install
```

### Langkah 3.4 — Isi data awal (pilih SALAH SATU cara)

**Cara 1 — Seed via aplikasi (paling mudah, disarankan):**
```bash
npm run seed
```

**Cara 2 — Import file database siap pakai (Node, tanpa tool tambahan):**
```bash
npm run import
```

**Cara 3 — Import via `mongoimport`** (perlu MongoDB Database Tools):
```bash
cd mongodb
bash import.sh
cd ..
```

**Cara 4 — Import via `mongosh`:**
```bash
mongosh "mongodb://127.0.0.1:27017/teman_berbagi" mongodb/teman_berbagi.mongosh.js
```

Semua cara menghasilkan data & akun yang sama (admin/user di atas).

### Langkah 3.5 — Jalankan server
```bash
npm start
```
Akan muncul:
```
✅ MongoDB terhubung: 127.0.0.1/teman_berbagi
🚀 Teman Berbagi API Server (MongoDB)
   Frontend : http://localhost:5000
```

### Langkah 3.6 — Buka aplikasi
Buka **<http://localhost:5000>**.

### Langkah 3.7 — Hentikan server
Tekan **Ctrl + C**.

### (Opsional) Mode pengembangan & testing
```bash
npm run dev     # auto-restart
npm test        # test memakai MongoDB in-memory, TIDAK perlu MongoDB nyata
```

---

# BAGIAN 4 — CARA MEMAKAI APLIKASI (kedua proyek sama)

1. Buka <http://localhost:5000> — muncul splash lalu halaman utama.
2. **Daftar** akun baru, atau **Masuk** dengan akun seed:
   - User: `ahmad@gmail.com` / `user123`
3. Jelajahi menu **Donasi, Kewajiban, Derma, Pilar Kebaikan**, lalu coba berdonasi.
4. **Panel Admin**: di halaman Daftar, klik tautan kecil **"Panel Admin"** di bawah, atau login sebagai admin (`admin@temanberbagi.id` / `admin123`). Di panel admin bisa membuat program (Fanplate), verifikasi donasi, dan melihat statistik.

---

# BAGIAN 5 — RINGKASAN PERINTAH (CHEAT SHEET)

### Proyek A — SQL
```bash
cd teman-berbagi-sql
npm install          # 1x di awal
npm run seed         # isi data awal
npm start            # jalankan → http://localhost:5000
```

### Proyek B — MongoDB
```bash
cd teman-berbagi-mongodb
npm install          # 1x di awal
npm run seed         # ATAU: npm run import
npm start            # jalankan → http://localhost:5000
```

---

# BAGIAN 6 — TROUBLESHOOTING (MASALAH UMUM)

### "node: command not found" / "npm bukan perintah yang dikenal"
Node.js belum ter-install atau belum masuk PATH. Install ulang dari nodejs.org lalu **tutup dan buka kembali Terminal**.

### Port 5000 sudah dipakai (`EADDRINUSE`)
Ada aplikasi lain memakai port 5000. Ubah `PORT` di file `.env` menjadi mis. `5001`, lalu jalankan ulang `npm start`.
> Jika mengubah PORT, sesuaikan juga `API_BASE` di `frontend/js/api.js` (mis. `http://localhost:5001/api`) agar frontend tetap terhubung. Cara termudah: biarkan PORT=5000.

### Proyek B: "MongoServerError" / "ECONNREFUSED 127.0.0.1:27017"
MongoDB belum berjalan. Jalankan service-nya:
- Windows: buka **Services** → start **MongoDB Server**, atau install ulang dengan opsi "as a Service".
- macOS: `brew services start mongodb-community@7.0`
- Linux: `sudo systemctl start mongod`
- Atau gunakan **MongoDB Atlas** dan isi `MONGO_URI` di `.env`.

### `npm install` gagal / lambat
- Pastikan ada koneksi internet.
- Coba ulang: `npm install`.
- Jika error terkait `sqlite3` saat build (Proyek A) di Windows, install **"Desktop development with C++"** lewat Visual Studio Build Tools, atau cukup pakai **Proyek B**.

### Login gagal padahal akun benar
Pastikan langkah **seed/import** sudah dijalankan sebelum `npm start`. Tanpa seed, database kosong.

### Halaman tampil tapi data tidak muncul / tombol tidak merespons
Pastikan Anda membuka **http://localhost:5000** (bukan membuka file `index.html` langsung dari folder). Backend harus menyala (`npm start`).

### Reset data dari awal
- Proyek A: hapus file `backend/database.sqlite`, lalu `npm run seed`.
- Proyek B: jalankan ulang `npm run seed` (otomatis menghapus & mengisi ulang).

---

# BAGIAN 7 — DEPLOY KE CLOUD (opsional)

Kedua proyek punya `Procfile` dan siap di-deploy ke **Railway / Render / Heroku**:
1. Push proyek ke repository Git (GitHub).
2. Buat service baru di platform, hubungkan repo.
3. Set environment variables: `JWT_SECRET`, `NODE_ENV=production`, dan (Proyek B) `MONGO_URI` (gunakan **MongoDB Atlas**).
4. Platform menjalankan `npm install` lalu `npm start` otomatis.
5. Jalankan seed sekali (mis. lewat konsol platform): `npm run seed`.

---

## Catatan Akun Default
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@temanberbagi.id` | `admin123` |
| User | `ahmad@gmail.com` | `user123` |
| User | `siti@gmail.com` | `user123` |
