import dotenv from 'dotenv';
dotenv.config({ path: '.env_test' });
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';

let token: string;
let userId: string;
let postId: string;
let commentId: string;

const userData = {
  username:  `commentuser_${Date.now()}`,
  email: `commentuser_${Date.now()}@example.com`,
  password: 'test123456',
  firstName: 'Test',
  lastName: 'Commenter'
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  if (mongoose.connection.db) {
          await mongoose.connection.db.dropDatabase();
        }

  // register
  const res = await request(app)
    .post('/api/auth/register')
    .send(userData);

  token = res.body.accessToken;
  userId = res.body.user._id;

  // create post
  const postRes = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      restaurantName: 'CommentPlace',
      text: 'Waiting for comments',
      rating: 4
    });

  postId = postRes.body._id;
});


it('should create a comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId,
        text: 'This is a test comment'
      });
  
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('This is a test comment');
    expect(res.body.userId).toBe(userId);
  
    commentId = res.body._id;
  });

  
  it('should get comments by postId', async () => {
    await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId,
        text: 'Another comment'
      });
  
    const res = await request(app).get(`/api/comments/post/${postId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  
  it('should return comment count for a post', async () => {
    await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId,
        text: 'Counting comment'
      });
  
    const res = await request(app).get(`/api/comments/post/${postId}/count`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });
  

  it('should update a comment', async () => {
    const createRes = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId,
        text: 'Old comment'
      });
  
    commentId = createRes.body._id;
  
    const updateRes = await request(app)
      .put(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Updated comment!' });
  
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.text).toBe('Updated comment!');
  });

  
  it('should delete a comment', async () => {
    const createRes = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        postId,
        text: 'To be deleted'
      });
  
    const deleteRes = await request(app)
      .delete(`/api/comments/${createRes.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe('Comment deleted');
  });

  
  