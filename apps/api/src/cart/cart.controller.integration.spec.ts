import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IntegrationTestHelper } from '../test/integration-test.helper';

describe('CartController (Integration)', () => {
  let app: INestApplication;
  let testHelper: IntegrationTestHelper;
  let userToken: string;
  let user2Token: string;
  let productId: number;

  beforeAll(async () => {
    testHelper = new IntegrationTestHelper();
    app = await testHelper.setupTestApp();
  });

  beforeEach(async () => {
    await testHelper.clearDatabase();

    // Create test user
    const userResponse = await testHelper.createTestUser({
      email: 'user@test.com',
      username: 'user',
      password: 'User123!',
    });
    userToken = userResponse.accessToken;

    // Create second test user
    const user2Response = await testHelper.createTestUser({
      email: 'user2@test.com',
      username: 'user2',
      password: 'User2123!',
    });
    user2Token = user2Response.accessToken;

    // Create test product
    const product = await testHelper.createTestProduct({
      name: 'Test Product',
      price: 99.99,
      stock: 10,
      category: 'Electronics',
    });
    productId = product.id;
  });

  afterAll(async () => {
    await testHelper.cleanupTestApp();
  });

  describe('GET /cart', () => {
    it('should get empty cart for authenticated user', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        cartItems: [],
        user: {
          id: expect.any(Number),
          email: 'user@test.com',
          username: 'user',
        },
      });
    });

    it('should get empty cart for guest user with session', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/cart')
        .set('x-session-id', 'guest-session-123')
        .expect(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        cartItems: [],
        user: null,
      });
    });

    it('should reject request without authentication or session', async () => {
      // When & Then
      await request(app.getHttpServer())
        .get('/cart')
        .expect(400);
    });

    it('should get cart with items after adding products', async () => {
      // Given - Add item to cart first
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId,
          quantity: 2,
        })
        .expect(201);

      // When & Then
      const response = await request(app.getHttpServer())
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0]).toMatchObject({
        quantity: 2,
        product: {
          id: productId,
          name: 'Test Product',
          price: 99.99,
        },
      });
    });
  });

  describe('GET /cart/summary', () => {
    beforeEach(async () => {
      // Add items to cart for summary tests
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId,
          quantity: 2,
        })
        .expect(201);
    });

    it('should get cart summary for authenticated user', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/cart/summary')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        totalItems: 2,
        totalAmount: 199.98,
        itemCount: 1,
        isEmpty: false,
      });
    });

    it('should get empty cart summary', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/cart/summary')
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        totalItems: 0,
        totalAmount: 0,
        itemCount: 0,
        isEmpty: true,
      });
    });
  });

  describe('POST /cart/items', () => {
    it('should add item to cart for authenticated user', async () => {
      // Given
      const addItemDto = {
        productId,
        quantity: 3,
      };

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(addItemDto)
        .expect(201);

      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0]).toMatchObject({
        quantity: 3,
        product: {
          id: productId,
        },
      });
    });

    it('should add item to guest cart with session', async () => {
      // Given
      const addItemDto = {
        productId,
        quantity: 1,
      };

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .set('x-session-id', 'guest-session-456')
        .send(addItemDto)
        .expect(201);

      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0]).toMatchObject({
        quantity: 1,
        product: {
          id: productId,
        },
      });
    });

    it('should increase quantity when adding existing item', async () => {
      // Given - Add item first time
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 })
        .expect(201);

      // When - Add same item again
      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 3 })
        .expect(201);

      // Then
      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0].quantity).toBe(5); // 2 + 3
    });

    it('should reject adding item with insufficient stock', async () => {
      // Given
      const addItemDto = {
        productId,
        quantity: 15, // Product has stock of 10
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(addItemDto)
        .expect(400);
    });

    it('should reject adding non-existent product', async () => {
      // Given
      const addItemDto = {
        productId: 99999,
        quantity: 1,
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(addItemDto)
        .expect(404);
    });

    it('should reject invalid quantity', async () => {
      // Given
      const addItemDto = {
        productId,
        quantity: 0,
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(addItemDto)
        .expect(400);
    });

    it('should reject request without authentication or session', async () => {
      // Given
      const addItemDto = {
        productId,
        quantity: 1,
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/cart/items')
        .send(addItemDto)
        .expect(400);
    });
  });

  describe('PATCH /cart/items/:id', () => {
    let cartItemId: number;

    beforeEach(async () => {
      // Add item to cart
      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 })
        .expect(201);

      cartItemId = response.body.cartItems[0].id;
    });

    it('should update cart item quantity', async () => {
      // Given
      const updateDto = { quantity: 5 };

      // When & Then
      const response = await request(app.getHttpServer())
        .patch(`/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.cartItems[0].quantity).toBe(5);
    });

    it('should reject updating item from different user', async () => {
      // Given
      const updateDto = { quantity: 3 };

      // When & Then
      await request(app.getHttpServer())
        .patch(`/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send(updateDto)
        .expect(403);
    });

    it('should reject updating with insufficient stock', async () => {
      // Given
      const updateDto = { quantity: 15 }; // Product has stock of 10

      // When & Then
      await request(app.getHttpServer())
        .patch(`/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateDto)
        .expect(400);
    });

    it('should reject zero or negative quantity', async () => {
      // Given
      const updateDto = { quantity: 0 };

      // When & Then
      await request(app.getHttpServer())
        .patch(`/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateDto)
        .expect(400);
    });

    it('should reject updating non-existent cart item', async () => {
      // Given
      const updateDto = { quantity: 2 };

      // When & Then
      await request(app.getHttpServer())
        .patch('/cart/items/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /cart/items/:id', () => {
    let cartItemId: number;

    beforeEach(async () => {
      // Add item to cart
      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 })
        .expect(201);

      cartItemId = response.body.cartItems[0].id;
    });

    it('should remove item from cart', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .delete(`/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.cartItems).toHaveLength(0);
    });

    it('should reject removing item from different user', async () => {
      // When & Then
      await request(app.getHttpServer())
        .delete(`/cart/items/${cartItemId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(403);
    });

    it('should reject removing non-existent cart item', async () => {
      // When & Then
      await request(app.getHttpServer())
        .delete('/cart/items/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('DELETE /cart', () => {
    beforeEach(async () => {
      // Add multiple items to cart
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 })
        .expect(201);
    });

    it('should clear all items from cart', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .delete('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Cart cleared successfully',
      });

      // Verify cart is empty
      const cartResponse = await request(app.getHttpServer())
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(cartResponse.body.cartItems).toHaveLength(0);
    });

    it('should clear guest cart with session', async () => {
      // Given - Add item to guest cart
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('x-session-id', 'guest-session-789')
        .send({ productId, quantity: 1 })
        .expect(201);

      // When & Then
      const response = await request(app.getHttpServer())
        .delete('/cart')
        .set('x-session-id', 'guest-session-789')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Cart cleared successfully',
      });
    });
  });

  describe('POST /cart/validate', () => {
    beforeEach(async () => {
      // Add item to cart
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 5 })
        .expect(201);
    });

    it('should validate cart with available stock', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .post('/cart/validate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: true,
        issues: [],
      });
    });

    it('should detect stock validation issues', async () => {
      // Given - Reduce product stock to create issue
      await testHelper.getPrismaService().product.update({
        where: { id: productId },
        data: { stock: 2 }, // Cart has 5 items, but only 2 in stock
      });

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/cart/validate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: false,
        issues: expect.arrayContaining([
          expect.stringContaining('Insufficient stock'),
        ]),
      });
    });

    it('should detect inactive product issues', async () => {
      // Given - Make product inactive
      await testHelper.getPrismaService().product.update({
        where: { id: productId },
        data: { isActive: false },
      });

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/cart/validate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: false,
        issues: expect.arrayContaining([
          expect.stringContaining('no longer active'),
        ]),
      });
    });
  });

  describe('POST /cart/merge', () => {
    it('should merge guest cart with user cart', async () => {
      // Given - Create guest cart with item
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('x-session-id', 'guest-merge-session')
        .send({ productId, quantity: 3 })
        .expect(201);

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/cart/merge')
        .set('Authorization', `Bearer ${userToken}`)
        .set('x-session-id', 'guest-merge-session')
        .expect(200);

      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0].quantity).toBe(3);
    });

    it('should merge carts with existing items', async () => {
      // Given - Add item to user cart
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 })
        .expect(201);

      // Add item to guest cart
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('x-session-id', 'guest-merge-session2')
        .send({ productId, quantity: 4 })
        .expect(201);

      // When & Then - Merge should take max quantity (4)
      const response = await request(app.getHttpServer())
        .post('/cart/merge')
        .set('Authorization', `Bearer ${userToken}`)
        .set('x-session-id', 'guest-merge-session2')
        .expect(200);

      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0].quantity).toBe(4);
    });

    it('should require authentication for cart merge', async () => {
      // When & Then
      await request(app.getHttpServer())
        .post('/cart/merge')
        .set('x-session-id', 'guest-session')
        .expect(401);
    });

    it('should require session ID for cart merge', async () => {
      // When & Then
      await request(app.getHttpServer())
        .post('/cart/merge')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe('POST /cart/checkout', () => {
    beforeEach(async () => {
      // Add item to cart for checkout
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 2 })
        .expect(201);
    });

    it('should convert cart to order', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .post('/cart/checkout')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);

      expect(response.body).toMatchObject({
        orderId: expect.any(Number),
        message: 'Order created successfully from cart',
      });

      // Verify cart is cleared after checkout
      const cartResponse = await request(app.getHttpServer())
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(cartResponse.body.cartItems).toHaveLength(0);

      // Verify product stock is reduced
      const productResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(productResponse.body.stock).toBe(8); // 10 - 2
    });

    it('should reject checkout with empty cart', async () => {
      // Given - Clear cart first
      await request(app.getHttpServer())
        .delete('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // When & Then
      await request(app.getHttpServer())
        .post('/cart/checkout')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });

    it('should require authentication for checkout', async () => {
      // When & Then
      await request(app.getHttpServer())
        .post('/cart/checkout')
        .expect(401);
    });

    it('should reject checkout with stock validation issues', async () => {
      // Given - Reduce product stock below cart quantity
      await testHelper.getPrismaService().product.update({
        where: { id: productId },
        data: { stock: 1 }, // Cart has 2 items
      });

      // When & Then
      await request(app.getHttpServer())
        .post('/cart/checkout')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe('Cart Session and Authentication Flow', () => {
    it('should maintain separate carts for different users', async () => {
      // Given - Add different items to different user carts
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, quantity: 3 })
        .expect(201);

      await request(app.getHttpServer())
        .post('/cart/items')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ productId, quantity: 5 })
        .expect(201);

      // When & Then - Verify each user has their own cart
      const user1Cart = await request(app.getHttpServer())
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      const user2Cart = await request(app.getHttpServer())
        .get('/cart')
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(200);

      expect(user1Cart.body.cartItems[0].quantity).toBe(3);
      expect(user2Cart.body.cartItems[0].quantity).toBe(5);
    });

    it('should maintain separate carts for different sessions', async () => {
      // Given - Add items to different session carts
      await request(app.getHttpServer())
        .post('/cart/items')
        .set('x-session-id', 'session-a')
        .send({ productId, quantity: 2 })
        .expect(201);

      await request(app.getHttpServer())
        .post('/cart/items')
        .set('x-session-id', 'session-b')
        .send({ productId, quantity: 4 })
        .expect(201);

      // When & Then - Verify each session has its own cart
      const cartA = await request(app.getHttpServer())
        .get('/cart')
        .set('x-session-id', 'session-a')
        .expect(200);

      const cartB = await request(app.getHttpServer())
        .get('/cart')
        .set('x-session-id', 'session-b')
        .expect(200);

      expect(cartA.body.cartItems[0].quantity).toBe(2);
      expect(cartB.body.cartItems[0].quantity).toBe(4);
    });
  });
});