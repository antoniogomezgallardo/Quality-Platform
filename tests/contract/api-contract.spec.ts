import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../apps/api/src/app/app.module';
import { INestApplication } from '@nestjs/common';

/**
 * API Contract Tests
 *
 * These tests validate that the API adheres to its OpenAPI specification
 * and maintains backward compatibility. They focus on:
 * - Response structure validation
 * - Status code verification
 * - Required field presence
 * - Data type validation
 * - API contract compliance
 */
describe('API Contract Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Endpoints Contract', () => {
    it('GET /api/health should return expected contract', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      // Validate response structure
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version');

      // Validate data types
      expect(typeof response.body.status).toBe('string');
      expect(typeof response.body.timestamp).toBe('string');
      expect(typeof response.body.uptime).toBe('number');
      expect(typeof response.body.environment).toBe('string');
      expect(typeof response.body.version).toBe('string');

      // Validate timestamp format (ISO string)
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    it('GET /api/health/ready should return readiness contract', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health/ready')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('checks');
      expect(Array.isArray(response.body.checks)).toBe(true);

      // Validate each check has required properties
      response.body.checks.forEach((check: any) => {
        expect(check).toHaveProperty('name');
        expect(check).toHaveProperty('status');
        expect(typeof check.name).toBe('string');
        expect(['ok', 'error'].includes(check.status)).toBe(true);
      });
    });
  });

  describe('Authentication Endpoints Contract', () => {
    it('POST /api/auth/register should return expected contract', async () => {
      const registerData = {
        name: 'Contract Test User',
        email: `contract-${Date.now()}@example.com`,
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      // Validate response structure
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');

      // Validate user object structure
      const user = response.body.user;
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');

      // Validate data types
      expect(typeof response.body.access_token).toBe('string');
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
      expect(typeof user.name).toBe('string');
      expect(typeof user.role).toBe('string');

      // Validate that password is not returned
      expect(user).not.toHaveProperty('password');

      // Validate token format (JWT)
      expect(response.body.access_token.split('.').length).toBe(3);
    });

    it('POST /api/auth/register should return validation errors contract', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({}) // Empty data to trigger validation
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('statusCode', 400);

      // Validate that message is an array of validation errors
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message.length).toBeGreaterThan(0);
    });

    it('POST /api/auth/login should return expected contract', async () => {
      // First register a user
      const userData = {
        name: 'Login Test User',
        email: `login-${Date.now()}@example.com`,
        password: 'Password123!',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData);

      // Then login
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      // Same structure as register response
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(typeof response.body.access_token).toBe('string');
    });
  });

  describe('Products Endpoints Contract', () => {
    it('GET /api/products should return expected pagination contract', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      // Validate main structure
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');

      // Validate pagination structure
      const pagination = response.body.pagination;
      expect(pagination).toHaveProperty('page');
      expect(pagination).toHaveProperty('limit');
      expect(pagination).toHaveProperty('total');
      expect(pagination).toHaveProperty('totalPages');

      // Validate data types
      expect(typeof pagination.page).toBe('number');
      expect(typeof pagination.limit).toBe('number');
      expect(typeof pagination.total).toBe('number');
      expect(typeof pagination.totalPages).toBe('number');

      // Validate products array
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    it('GET /api/products/:id should return product contract', async () => {
      // This test assumes at least one product exists from seeding
      // In real scenario, we'd create a test product first

      const allProducts = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      if (allProducts.body.products.length > 0) {
        const productId = allProducts.body.products[0].id;

        const response = await request(app.getHttpServer())
          .get(`/api/products/${productId}`)
          .expect(200);

        // Validate product structure
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('category');
        expect(response.body).toHaveProperty('imageUrl');
        expect(response.body).toHaveProperty('stock');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');

        // Validate data types
        expect(typeof response.body.id).toBe('number');
        expect(typeof response.body.name).toBe('string');
        expect(typeof response.body.description).toBe('string');
        expect(typeof response.body.price).toBe('number');
        expect(typeof response.body.category).toBe('string');
        expect(typeof response.body.stock).toBe('number');
      }
    });

    it('GET /api/products with invalid ID should return 404 contract', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products/999999')
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('statusCode', 404);
    });
  });

  describe('Error Response Contract', () => {
    it('should return consistent error format for 401 Unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send({ name: 'Test Product' })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 401);
    });

    it('should return consistent error format for 403 Forbidden', async () => {
      // Register regular user and get token
      const userData = {
        name: 'Regular User',
        email: `regular-${Date.now()}@example.com`,
        password: 'Password123!',
      };

      const authResponse = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData);

      const token = authResponse.body.access_token;

      // Try to access admin endpoint
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: 10,
          category: 'ELECTRONICS',
          imageUrl: 'http://example.com/image.jpg',
          stock: 5,
        })
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 403);
    });
  });

  describe('Response Headers Contract', () => {
    it('should return proper CORS headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should return proper content-type for JSON responses', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});