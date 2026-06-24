/**
 * server.js  (MongoDB/Mongoose)
 * Entry point: hubungkan MongoDB lalu jalankan server
 */

require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 Teman Berbagi API Server (MongoDB)`);
      console.log(`   Backend  : http://localhost:${PORT}/api`);
      console.log(`   Frontend : http://localhost:${PORT}`);
      console.log(`   Health   : http://localhost:${PORT}/api/health`);
      console.log(`   Mode     : ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error.message);
    process.exit(1);
  }
}

startServer();
