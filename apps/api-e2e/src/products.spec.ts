import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
  let adminToken: string;

  // Test data
  const testProduct = {
    name: 'Test Product',
    description: 'A test product for e2e testing',
    price: 29.99,
    category: 'ELECTRONICS',
    imageUrl: 'https://example.com/product.jpg',
    stock: 50,
  };

  const testUser = {
    email: 'testuser@example.com',
    password: 'password123',
    name: 'Test User',
  };

  const testAdmin = {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
  };

  beforeAll(async () => {
    // Create testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Apply same middleware as main app
    app.setGlobalPrefix('api');
    await app.init();

    // Clean database and create test data
    await cleanDatabase();
    await createTestUsers();
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
  });

  beforeEach(async () => {
    // Clean products before each test
    await prismaService.product.deleteMany();
  });

  async function cleanDatabase() {
    await prismaService.orderItem.deleteMany();
    await prismaService.order.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.product.deleteMany();
    await prismaService.user.deleteMany();
  }

  async function createTestUsers() {
    // Create regular user
    const userResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    authToken = userResponse.body.access_token;

    // Create admin user
    const admin = await prismaService.user.create({
      data: {
        email: testAdmin.email,
        password: '$2a$10$hashedpassword', // Pre-hashed
        name: testAdmin.name,
        role: 'ADMIN',
      },
    });

    adminToken = jwtService.sign({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });
  }

  describe('GET /api/products', () => {
    it('should return empty array when no products exist', async () => {
      // When: Getting products
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      // Then: Should return empty array
      expect(response.body).toEqual({
        products: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    });

    it('should return products with pagination', async () => {
      // Given: Products exist
      await prismaService.product.createMany({
        data: [
          { ...testProduct, name: 'Product 1' },
          { ...testProduct, name: 'Product 2' },
        ],
      });

      // When: Getting products
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      // Then: Should return products with pagination
      expect(response.body.products).toHaveLength(2);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });

    it('should filter products by category', async () => {
      // Given: Products in different categories
      await prismaService.product.createMany({
        data: [
          { ...testProduct, name: 'Electronics Product', category: 'ELECTRONICS' },
          { ...testProduct, name: 'Clothing Product', category: 'CLOTHING' },
        ],
      });

      // When: Filtering by category
      const response = await request(app.getHttpServer())
        .get('/api/products?category=ELECTRONICS')
        .expect(200);

      // Then: Should return only electronics products
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].category).toBe('ELECTRONICS');
    });

    it('should search products by name', async () => {
      // Given: Products with different names
      await prismaService.product.createMany({
        data: [
          { ...testProduct, name: 'iPhone 15' },
          { ...testProduct, name: 'Samsung Galaxy' },
        ],
      });

      // When: Searching by name
      const response = await request(app.getHttpServer())
        .get('/api/products?search=iPhone')
        .expect(200);

      // Then: Should return matching products
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toContain('iPhone');
    });
  });

  describe('POST /api/products', () => {
    it('should create product as admin', async () => {
      // When: Creating product as admin
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testProduct)
        .expect(201);

      // Then: Product should be created
      expect(response.body).toMatchObject({
        name: testProduct.name,
        price: testProduct.price,
        category: testProduct.category,
        stock: testProduct.stock,
      });
      expect(response.body.id).toBeDefined();
    });

    it('should reject creation without admin token', async () => {
      // When: Creating product without admin token
      await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testProduct)
        .expect(403);
    });

    it('should reject creation without authentication', async () => {
      // When: Creating product without authentication
      await request(app.getHttpServer())
        .post('/api/products')
        .send(testProduct)
        .expect(401);
    });

    it('should validate required fields', async () => {
      // When: Creating product with missing required fields
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Product' }) // Missing required fields
        .expect(400);

      // Then: Should return validation errors
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('description'),
          expect.stringContaining('price'),
          expect.stringContaining('category'),
        ])
      );
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return single product', async () => {
      // Given: Product exists
      const product = await prismaService.product.create({
        data: testProduct,
      });

      // When: Getting single product
      const response = await request(app.getHttpServer())
        .get(`/api/products/${product.id}`)
        .expect(200);

      // Then: Should return product details
      expect(response.body).toMatchObject({
        id: product.id,
        name: testProduct.name,
        price: testProduct.price,
      });
    });

    it('should return 404 for non-existent product', async () => {
      // When: Getting non-existent product
      await request(app.getHttpServer())
        .get('/api/products/999')
        .expect(404);
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('should update product as admin', async () => {
      // Given: Product exists
      const product = await prismaService.product.create({
        data: testProduct,
      });

      const updateData = { name: 'Updated Product Name', price: 39.99 };

      // When: Updating product as admin
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      // Then: Product should be updated
      expect(response.body).toMatchObject({
        id: product.id,
        name: updateData.name,
        price: updateData.price,
      });
    });

    it('should reject update without admin privileges', async () => {
      // Given: Product exists
      const product = await prismaService.product.create({
        data: testProduct,
      });

      // When: Updating product as regular user
      await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(403);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product as admin', async () => {
      // Given: Product exists
      const product = await prismaService.product.create({
        data: testProduct,
      });

      // When: Deleting product as admin
      await request(app.getHttpServer())
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Then: Product should be deleted
      const deletedProduct = await prismaService.product.findUnique({
        where: { id: product.id },
      });
      expect(deletedProduct).toBeNull();
    });

    it('should reject deletion without admin privileges', async () => {
      // Given: Product exists
      const product = await prismaService.product.create({
        data: testProduct,
      });

      // When: Deleting product as regular user
      await request(app.getHttpServer())
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });
});