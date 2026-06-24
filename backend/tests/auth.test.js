/**
 * tests/auth.test.js  (MongoDB/Mongoose)
 * ─────────────────────────────────────────────────────────────
 * Testing API menggunakan Jest + Supertest + mongodb-memory-server
 * (database MongoDB in-memory, tidak butuh server MongoDB nyata).
 * Materi: Testing aplikasi menggunakan Jest
 */

const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  await mongoose.connect(process.env.MONGO_URI);
  app = require('../app');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Auth API (MongoDB)', () => {
  let token;

  describe('POST /api/auth/register', () => {
    it('harus berhasil mendaftarkan user baru', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser', email: 'test@example.com',
        password: 'test123', tgl_lahir: '2000-01-01',
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('_id');
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data).toHaveProperty('token');
    });

    it('harus gagal jika email sudah terdaftar', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser2', email: 'test@example.com', password: 'test123',
      });
      expect(res.statusCode).toBe(409);
    });

    it('harus gagal jika password kurang dari 6 karakter', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'shortpw', email: 'short@example.com', password: '123',
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('harus berhasil login dengan email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        login: 'test@example.com', password: 'test123',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
      token = res.body.data.token;
    });

    it('harus gagal jika password salah', async () => {
      const res = await request(app).post('/api/auth/login').send({
        login: 'testuser', password: 'salah',
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('harus mengembalikan data user yang login', async () => {
      const res = await request(app).get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.username).toBe('testuser');
    });

    it('harus gagal tanpa token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });
});

describe('Donasi API (MongoDB)', () => {
  let adminToken, donasiId;

  beforeAll(async () => {
    const { User } = require('../models');
    const { generateToken } = require('../middleware/auth');
    const admin = await User.create({
      username: 'admin2', email: 'admin2@test.com',
      password: 'admin123', role: 'admin',
    });
    adminToken = generateToken(admin);
  });

  it('admin harus bisa membuat program donasi', async () => {
    const res = await request(app).post('/api/donasi')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Program Test', deskripsi: 'desc', target: 1000000 });
    expect(res.statusCode).toBe(201);
    donasiId = res.body.data._id;
  });

  it('harus mengembalikan daftar donasi', async () => {
    const res = await request(app).get('/api/donasi');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('admin harus bisa publikasikan donasi', async () => {
    const res = await request(app).patch(`/api/donasi/${donasiId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.verified).toBe(true);
  });

  it('admin harus bisa hapus donasi', async () => {
    const res = await request(app).delete(`/api/donasi/${donasiId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Health Check', () => {
  it('GET /api/health harus OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
