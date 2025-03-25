import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config({ path: '.env_test' });
import mongoose from 'mongoose';
import app from '../src/index'; // ודאי שבקובץ index.ts את עושה export ל־app

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const userData = {
    username: 'TestUser',
    email: 'testuser@example.com',
    password: 'test123456',
    firstName: 'Test',
    lastName: 'User'
  };
  

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.accessToken).toBeDefined();
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(userData);


    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
  });

  it('should fail duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(res.status).toBe(400);
  });
});

test('basic sanity test', () => {
    expect(true).toBe(true);
  });
  