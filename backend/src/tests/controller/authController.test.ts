// src/tests/controllers/authController.test.ts
import request from 'supertest'
import app from '../../app'
import { dbPool } from '../../utils/db'

describe('Auth Controller', () => {
  afterAll(() => dbPool.end())

  it('should signup and login a user', async () => {
    const email = `test${Date.now()}@example.com`
    const pass = 'Password123!'

    // Signup
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({ email, password: pass, role: 'User' })
    expect(signupRes.status).toBe(201)
    expect(signupRes.body).toHaveProperty('id')

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: pass })
    expect(loginRes.status).toBe(200)
    expect(loginRes.body).toHaveProperty('token')
  })
})
