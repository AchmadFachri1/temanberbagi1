#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# import.sh — Import database Teman Berbagi ke MongoDB
#
# Menggunakan `mongoimport` (bagian dari MongoDB Database Tools).
# Tidak butuh konfigurasi tambahan: data sudah lengkap dengan
# _id (ObjectId), relasi antar-collection, dan hash password.
#
# Cara pakai:
#   bash import.sh                  # ke mongodb://127.0.0.1:27017
#   MONGO_URI=mongodb://host/db bash import.sh
# ─────────────────────────────────────────────────────────────
set -e

DB_NAME="${DB_NAME:-teman_berbagi}"
HOST="${MONGO_HOST:-127.0.0.1}"
PORT="${MONGO_PORT:-27017}"
DATA_DIR="$(dirname "$0")/data"

echo "📦 Mengimpor database '$DB_NAME' ke $HOST:$PORT ..."

import_collection () {
  local coll="$1"
  echo "  → collection: $coll"
  mongoimport \
    --host "$HOST" --port "$PORT" \
    --db "$DB_NAME" --collection "$coll" \
    --file "$DATA_DIR/$coll.json" \
    --jsonArray --mode=upsert --upsertFields _id
}

import_collection users
import_collection donasi
import_collection transaksi
import_collection kontak
import_collection pilardonatur

echo "✅ Import selesai!"
echo "   Login admin : admin@temanberbagi.id / admin123"
echo "   Login user  : ahmad@gmail.com / user123"
