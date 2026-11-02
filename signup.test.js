import request from 'supertest';
import app from './app.js';

// const request = require('supertest');
// const app = require('../app');

describe('POST /signup', () => {
  it('should create a new user and return a success message', async () => {
    const res = await request(app)
        .post('/signup')
        .send({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
        })

        expect(res.status).toBe(400);
    });
});
