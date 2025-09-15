import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IntegrationTestHelper } from '../test/integration-test.helper';

describe('ProductsController (Integration)', () => {
  let app: INestApplication;
  let testHelper: IntegrationTestHelper;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    testHelper = new IntegrationTestHelper();
    app = await testHelper.setupTestApp();
  });

  beforeEach(async () => {
    await testHelper.clearDatabase();

    // Create admin user and get token
    const adminUser = await testHelper.createAdminUser({
      email: 'admin@test.com',
      username: 'admin',
      password: 'Admin123!',
    });

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin123!',
      })
      .expect(200);

    adminToken = adminLoginResponse.body.accessToken;

    // Create regular user and get token
    const userResponse = await testHelper.createTestUser({
      email: 'user@test.com',
      username: 'user',
      password: 'User123!',
    });

    userToken = userResponse.accessToken;
  });

  afterAll(async () => {
    await testHelper.cleanupTestApp();
  });

  describe('POST /products', () => {
    it('should create a product as admin', async () => {
      // Given
      const createProductDto = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        imageUrl: 'https://example.com/image.jpg',
      };

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createProductDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        category: createProductDto.category,
        imageUrl: createProductDto.imageUrl,
        isActive: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should reject product creation as regular user', async () => {
      // Given
      const createProductDto = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(createProductDto)
        .expect(403);
    });

    it('should reject product creation without authentication', async () => {
      // Given
      const createProductDto = {
        name: 'Test Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(401);
    });

    it('should reject product creation with invalid data', async () => {
      // Given
      const invalidProductDto = {
        name: '', // Empty name
        price: -10, // Negative price
        stock: -5, // Negative stock
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidProductDto)
        .expect(400);
    });
  });

  describe('GET /products', () => {
    beforeEach(async () => {
      // Create test products
      await testHelper.createTestProduct({
        name: 'Electronics Product 1',
        price: 199.99,
        category: 'Electronics',
        stock: 5,
      });

      await testHelper.createTestProduct({
        name: 'Electronics Product 2',
        price: 299.99,
        category: 'Electronics',
        stock: 0,
        isActive: false,
      });

      await testHelper.createTestProduct({
        name: 'Clothing Product',
        price: 49.99,
        category: 'Clothing',
        stock: 15,
      });
    });

    it('should get all products with default pagination', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toMatchObject({
        products: expect.any(Array),
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });

      expect(response.body.products).toHaveLength(3);
    });

    it('should filter products by category', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?category=Electronics')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(response.body.products.every(p => p.category === 'Electronics')).toBe(true);
    });

    it('should filter products by price range', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?minPrice=100&maxPrice=250')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].price).toBeGreaterThanOrEqual(100);
      expect(response.body.products[0].price).toBeLessThanOrEqual(250);
    });

    it('should filter products by stock availability', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?inStock=true')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(response.body.products.every(p => p.stock > 0)).toBe(true);
    });

    it('should filter products by active status', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?isActive=true')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(response.body.products.every(p => p.isActive === true)).toBe(true);
    });

    it('should search products by name', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?search=Clothing')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toContain('Clothing');
    });

    it('should paginate products correctly', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?page=1&limit=2')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      });
    });

    it('should sort products by price ascending', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?sortBy=price&sortOrder=asc')
        .expect(200);

      const prices = response.body.products.map(p => p.price);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    it('should sort products by price descending', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products?sortBy=price&sortOrder=desc')
        .expect(200);

      const prices = response.body.products.map(p => p.price);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });

  describe('GET /products/categories', () => {
    beforeEach(async () => {
      await testHelper.createTestProduct({ category: 'Electronics' });
      await testHelper.createTestProduct({ category: 'Electronics' });
      await testHelper.createTestProduct({ category: 'Clothing' });
    });

    it('should get all product categories', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products/categories')
        .expect(200);

      expect(response.body).toMatchObject({
        categories: expect.arrayContaining(['Electronics', 'Clothing']),
        count: 2,
      });
    });
  });

  describe('GET /products/search/:term', () => {
    beforeEach(async () => {
      await testHelper.createTestProduct({
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone',
        category: 'Electronics',
      });

      await testHelper.createTestProduct({
        name: 'Samsung Galaxy',
        description: 'Android smartphone',
        category: 'Electronics',
      });
    });

    it('should search products by term', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products/search/iPhone')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toContain('iPhone');
    });

    it('should return empty array for non-matching search', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products/search/NonExistent')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /products/category/:category', () => {
    beforeEach(async () => {
      await testHelper.createTestProduct({ category: 'Electronics' });
      await testHelper.createTestProduct({ category: 'Electronics' });
      await testHelper.createTestProduct({ category: 'Clothing' });
    });

    it('should get products by category', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products/category/Electronics')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(p => p.category === 'Electronics')).toBe(true);
    });

    it('should return empty array for non-existent category', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products/category/NonExistent')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /products/:id', () => {
    let productId: number;

    beforeEach(async () => {
      const product = await testHelper.createTestProduct();
      productId = product.id;
    });

    it('should get product by id', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: productId,
        name: expect.any(String),
        price: expect.any(Number),
        category: expect.any(String),
      });
    });

    it('should return 404 for non-existent product', async () => {
      // When & Then
      await request(app.getHttpServer())
        .get('/products/99999')
        .expect(404);
    });

    it('should return 400 for invalid product id', async () => {
      // When & Then
      await request(app.getHttpServer())
        .get('/products/invalid')
        .expect(400);
    });
  });

  describe('PATCH /products/:id', () => {
    let productId: number;

    beforeEach(async () => {
      const product = await testHelper.createTestProduct();
      productId = product.id;
    });

    it('should update product as admin', async () => {
      // Given
      const updateDto = {
        name: 'Updated Product',
        price: 149.99,
      };

      // When & Then
      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: productId,
        name: updateDto.name,
        price: updateDto.price,
      });
    });

    it('should reject update as regular user', async () => {
      // Given
      const updateDto = { name: 'Updated Product' };

      // When & Then
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateDto)
        .expect(403);
    });

    it('should reject update without authentication', async () => {
      // Given
      const updateDto = { name: 'Updated Product' };

      // When & Then
      await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(updateDto)
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      // Given
      const updateDto = { name: 'Updated Product' };

      // When & Then
      await request(app.getHttpServer())
        .patch('/products/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('PATCH /products/:id/stock', () => {
    let productId: number;

    beforeEach(async () => {
      const product = await testHelper.createTestProduct({ stock: 10 });
      productId = product.id;
    });

    it('should update product stock as admin', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 20 })
        .expect(200);

      expect(response.body.stock).toBe(20);
    });

    it('should reject stock update as regular user', async () => {
      // When & Then
      await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 })
        .expect(403);
    });

    it('should reject negative stock quantity', async () => {
      // When & Then
      await request(app.getHttpServer())
        .patch(`/products/${productId}/stock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 })
        .expect(400);
    });
  });

  describe('DELETE /products/:id', () => {
    let productId: number;

    beforeEach(async () => {
      const product = await testHelper.createTestProduct();
      productId = product.id;
    });

    it('should delete product as admin', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        message: expect.any(String),
      });

      // Verify product is deleted
      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);
    });

    it('should reject delete as regular user', async () => {
      // When & Then
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should reject delete without authentication', async () => {
      // When & Then
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      // When & Then
      await request(app.getHttpServer())
        .delete('/products/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});