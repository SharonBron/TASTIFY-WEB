import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../src/index';

let token: string;
let userId: string;

const userData = {
  username: `PostUser${Date.now()}`,
  email: `postuser_${Date.now()}@example.com`,
  password: 'post123456',
  firstName: 'Post',
  lastName: 'Tester'
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
      

      const res = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    token = res.body.accessToken;
    // הגנה אם user לא קיים
  if (!res.body.user) {
    throw new Error(' User not returned from /register');
  }

  userId = res.body.user._id;
  
});

it('should create a post with image (without actual upload)', async () => {
    const postData = {
      restaurantName: 'Test Restaurant',
      text: 'Great food!',
      rating: 5
    };
  
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData); // בלי תמונה בשלב זה
  
    expect(res.status).toBe(201);
    expect(res.body.restaurantName).toBe(postData.restaurantName);
    expect(res.body.text).toBe(postData.text);
    expect(res.body.rating).toBe(postData.rating);
    expect(res.body.images).toEqual([]); // כי לא שלחנו תמונה
    expect(res.body.userId).toBe(userId);
  });

  
  import path from 'path';

it('should create a post with an image upload', async () => {
  const imagePath = path.join(__dirname, 'test-image.jpg'); // קובץ בדיקה

  const res = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .field('restaurantName', 'Image Restaurant')
    .field('text', 'Yummy with pic')
    .field('rating', '4')
    .attach('image', imagePath);

  expect(res.status).toBe(201);
  expect(res.body.images.length).toBe(1);
});

it('should update a post', async () => {
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantName: 'Original',
        text: 'Before update',
        rating: 3
      });
  
    const updated = await request(app)
      .put(`/api/posts/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'After update',
        rating: 5
      });
  
    expect(updated.status).toBe(200);
    expect(updated.body.text).toBe('After update');
    expect(updated.body.rating).toBe(5);
  });

  
  it('should delete a post', async () => {
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantName: 'To Delete',
        text: 'Bye!',
        rating: 1
      });
  
    const deleted = await request(app)
      .delete(`/api/posts/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(deleted.status).toBe(200);
    expect(deleted.body.message).toBe('Post deleted');
  });

  
  it('should get post details with likes and comments', async () => {
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantName: 'Detail Place',
        text: 'Look at me',
        rating: 4
      });
  
    const res = await request(app)
      .get(`/api/posts/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.status).toBe(200);
    expect(res.body.post.text).toBe('Look at me');
    expect(res.body.likesCount).toBeDefined();
    expect(res.body.comments).toEqual([]);
    expect(res.body.likedByMe).toBe(false);
  });

  
  it('should toggle like on post', async () => {
    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantName: 'LikeMe',
        text: 'I want likes',
        rating: 5
      });
  
    const like = await request(app)
      .put(`/api/posts/${created.body._id}/like`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(like.status).toBe(200);
    expect(like.body.liked).toBe(true);
    expect(like.body.totalLikes).toBe(1);
  
    const unlike = await request(app)
      .put(`/api/posts/${created.body._id}/like`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(unlike.status).toBe(200);
    expect(unlike.body.liked).toBe(false);
    expect(unlike.body.totalLikes).toBe(0);
  });

  
  it('should get all posts with pagination', async () => {
    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantName: 'Post1',
        text: 'Test 1',
        rating: 3
      });
  
    await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurantName: 'Post2',
        text: 'Test 2',
        rating: 4
      });
  
    const res = await request(app).get('/api/posts?page=1&limit=10');
  
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBeGreaterThanOrEqual(2);
    expect(res.body.total).toBeGreaterThanOrEqual(2);
    expect(res.body.currentPage).toBe(1);
  });

  
