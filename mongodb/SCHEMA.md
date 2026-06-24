# Skema Database MongoDB — Teman Berbagi

Database: **`teman_berbagi`**

## Daftar Collection

| Collection | Jumlah Seed | Keterangan |
|------------|-------------|-----------|
| `users` | 3 | Akun pengguna & admin |
| `donasi` | 7 | Program penggalangan dana |
| `transaksi` | 7 | Pembayaran donasi dari donatur |
| `kontak` | 1 | Pesan dari form kontak |
| `pilardonatur` | 4 | Donatur tetap bulanan |

## Relasi Antar-Collection

MongoDB tidak punya foreign key seperti SQL. Relasi diwakili dengan **referensi `ObjectId`** dan di-resolve memakai `.populate()` di Mongoose.

```
users (1) ─────< transaksi (N)        transaksi.user   → users._id
donasi (1) ────< transaksi (N)        transaksi.donasi → donasi._id
users (1) ─────< pilardonatur (N)     pilardonatur.user → users._id
```

Diagram:

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│    users     │ 1     N │    transaksi     │ N     1 │    donasi    │
│──────────────│◄────────│──────────────────│────────►│──────────────│
│ _id          │  user   │ _id              │ donasi  │ _id          │
│ username (U) │         │ user   (ref)     │         │ title        │
│ email (U)    │         │ donasi (ref)     │         │ target       │
│ password     │         │ nama, jumlah     │         │ jumlah       │
│ role         │         │ status, kategori │         │ fitur        │
└──────┬───────┘         └──────────────────┘         │ verified     │
       │ 1                                             └──────────────┘
       │
       │ N
┌──────▼────────┐        ┌──────────────┐
│ pilardonatur  │        │   kontak     │  (mandiri, tanpa relasi)
│───────────────│        │──────────────│
│ _id, user(ref)│        │ _id, nama    │
│ nama, nominal │        │ email, pesan │
│ aktif         │        │ dibaca       │
└───────────────┘        └──────────────┘
```

## Detail Schema

### `users`
| Field | Tipe | Aturan |
|-------|------|--------|
| `_id` | ObjectId | PK |
| `username` | String | wajib, **unique**, 2–50 char |
| `email` | String | wajib, **unique**, format email, lowercase |
| `password` | String | wajib, hash `scrypt$<salt>$<hash>` |
| `name` | String | - |
| `tgl_lahir` | Date | nullable |
| `telepon` | String | default `''` |
| `alamat` | String | default `''` |
| `role` | String | enum `user` / `admin`, default `user` |
| `createdAt` / `updatedAt` | Date | otomatis (timestamps) |

> **Password**: di-hash dengan `crypto.scrypt` bawaan Node.js (tanpa dependency eksternal). Verifikasi memakai `crypto.timingSafeEqual`. Data seed sudah berisi hash valid sehingga login langsung berfungsi setelah import.

### `donasi`
| Field | Tipe | Aturan |
|-------|------|--------|
| `_id` | ObjectId | PK |
| `img` | String | URL gambar |
| `title` | String | wajib |
| `deskripsi`, `konten` | String | - |
| `hari` | Number | default 30 |
| `jumlah` | Number | dana terkumpul, default 0 |
| `target` | Number | default 500000 |
| `deadline` | Date | nullable |
| `fitur` | String | enum `donasi`/`kewajiban`/`derma`/`pilar-kebaikan` |
| `verified` | Boolean | default false |
| `bank`, `no_rekening`, `nama_rekening` | String | nullable |

### `transaksi`
| Field | Tipe | Aturan |
|-------|------|--------|
| `_id` | ObjectId | PK |
| `user` | ObjectId → `users` | nullable (boleh donasi tanpa login) |
| `donasi` | ObjectId → `donasi` | nullable |
| `nama` | String | wajib |
| `email` | String | - |
| `program` | String | wajib |
| `jumlah` | Number | wajib, min 1000 |
| `metode` | String | default `Transfer` |
| `bukti` | Boolean | default false |
| `bukti_foto` | String | nullable |
| `status` | String | enum `pending`/`verified`/`rejected` |
| `kategori` | String | enum `donasi`/`zakat`/`persepuhan`/`stipendium`/`derma`/`pilar` |
| `tanggal` | Date | default now |

### `kontak`
| Field | Tipe | Aturan |
|-------|------|--------|
| `_id` | ObjectId | PK |
| `nama` | String | wajib |
| `email` | String | wajib, format email |
| `subjek` | String | nullable |
| `pesan` | String | wajib |
| `dibaca` | Boolean | default false |

### `pilardonatur`
| Field | Tipe | Aturan |
|-------|------|--------|
| `_id` | ObjectId | PK |
| `user` | ObjectId → `users` | nullable |
| `nama` | String | wajib |
| `email` | String | wajib |
| `nominal` | Number | wajib, min 10000 |
| `aktif` | Boolean | default true |
| `bulan_aktif` | Number | default 1 |

## Index yang Dibuat Otomatis (Mongoose)
- `users.username` — unique
- `users.email` — unique

## Akun Seed
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@temanberbagi.id` | `admin123` |
| User | `ahmad@gmail.com` | `user123` |
| User | `siti@gmail.com` | `user123` |
