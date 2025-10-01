const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  it('should return health status', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('HR Dashboard API is running');
  });
});

describe('API Documentation', () => {
  it('should return API documentation', async () => {
    const res = await request(app)
      .get('/api')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('HR Dashboard API');
    expect(res.body.endpoints).toBeDefined();
  });
});

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const res = await request(app)
      .get('/non-existent-route')
      .expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route not found');
  });
});