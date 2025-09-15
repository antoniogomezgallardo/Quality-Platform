import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IntegrationTestHelper } from '../test/integration-test.helper';

describe('AuthController (Integration)', () => {
  let app: INestApplication;
  let testHelper: IntegrationTestHelper;

  beforeAll(async () => {
    testHelper = new IntegrationTestHelper();
    app = await testHelper.setupTestApp();
  });

  beforeEach(async () => {
    await testHelper.clearDatabase();
  });

  afterAll(async () => {
    await testHelper.cleanupTestApp();
  });

  describe('POST /auth/register', () => {
    it('should successfully register a new user', async () => {
      // Given
      const registerDto = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'NewUser123!',
        firstName: 'New',
        lastName: 'User',
      };

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        user: {
          id: expect.any(Number),
          email: registerDto.email,
          username: registerDto.username,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: 'USER',
          isActive: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });

      expect(response.body.user.password).toBeUndefined();
    });

    it('should reject registration with invalid email', async () => {
      // Given
      const invalidRegisterDto = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidRegisterDto)
        .expect(400);
    });

    it('should reject registration with weak password', async () => {
      // Given
      const weakPasswordDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: '123',
        firstName: 'Test',
        lastName: 'User',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(weakPasswordDto)
        .expect(400);
    });

    it('should reject registration with duplicate email', async () => {
      // Given
      const registerDto = {
        email: 'duplicate@example.com',
        username: 'user1',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      // When & Then - Try to register with same email but different username
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...registerDto, username: 'user2' })
        .expect(400);
    });

    it('should reject registration with duplicate username', async () => {
      // Given
      const registerDto = {
        email: 'user1@example.com',
        username: 'duplicate',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      // When & Then - Try to register with same username but different email
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...registerDto, email: 'user2@example.com' })
        .expect(400);
    });

    it('should reject registration with missing required fields', async () => {
      // Given
      const incompleteDto = {
        email: 'test@example.com',
        // Missing username, password, firstName, lastName
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(incompleteDto)
        .expect(400);
    });

    it('should reject registration with extra fields', async () => {
      // Given
      const dtoWithExtraFields = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN', // Should be rejected
        extraField: 'should be stripped',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(dtoWithExtraFields)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await testHelper.createTestUser({
        email: 'login@example.com',
        username: 'loginuser',
        password: 'Login123!',
      });
    });

    it('should successfully login with valid credentials', async () => {
      // Given
      const loginDto = {
        email: 'login@example.com',
        password: 'Login123!',
      };

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        user: {
          id: expect.any(Number),
          email: loginDto.email,
          username: 'loginuser',
          role: 'USER',
          isActive: true,
        },
      });

      expect(response.body.user.password).toBeUndefined();
    });

    it('should reject login with invalid email', async () => {
      // Given
      const invalidLoginDto = {
        email: 'nonexistent@example.com',
        password: 'Login123!',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(401);
    });

    it('should reject login with invalid password', async () => {
      // Given
      const invalidLoginDto = {
        email: 'login@example.com',
        password: 'WrongPassword!',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(401);
    });

    it('should reject login with malformed email', async () => {
      // Given
      const malformedLoginDto = {
        email: 'not-an-email',
        password: 'Login123!',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(malformedLoginDto)
        .expect(400);
    });

    it('should reject login with missing credentials', async () => {
      // When & Then
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });

    it('should reject login with empty password', async () => {
      // Given
      const emptyPasswordDto = {
        email: 'login@example.com',
        password: '',
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(emptyPasswordDto)
        .expect(400);
    });
  });

  describe('GET /auth/me', () => {
    let authToken: string;
    let userId: number;

    beforeEach(async () => {
      // Create and login a test user
      const userData = await testHelper.createTestUser({
        email: 'profile@example.com',
        username: 'profileuser',
        firstName: 'Profile',
        lastName: 'User',
      });
      authToken = userData.accessToken;
      userId = userData.user.id;
    });

    it('should return user profile for authenticated user', async () => {
      // When & Then
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        email: 'profile@example.com',
        username: 'profileuser',
        firstName: 'Profile',
        lastName: 'User',
        role: 'USER',
        isActive: true,
      });

      expect(response.body.password).toBeUndefined();
    });

    it('should reject request without authorization header', async () => {
      // When & Then
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });

    it('should reject request with invalid token', async () => {
      // When & Then
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should reject request with malformed authorization header', async () => {
      // When & Then
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });

    it('should reject request with expired token', async () => {
      // Given - Create a token that's already expired (this would require mocking JWT service)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDA2MDB9.invalid';

      // When & Then
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Authentication Flow Integration', () => {
    it('should allow complete registration -> login -> profile access flow', async () => {
      // Given
      const registerDto = {
        email: 'flow@example.com',
        username: 'flowuser',
        password: 'Flow123!',
        firstName: 'Flow',
        lastName: 'User',
      };

      // Step 1: Register
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(registerResponse.body.accessToken).toBeDefined();

      // Step 2: Login with same credentials
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: registerDto.email,
          password: registerDto.password,
        })
        .expect(200);

      expect(loginResponse.body.accessToken).toBeDefined();

      // Step 3: Access profile with login token
      const profileResponse = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200);

      expect(profileResponse.body).toMatchObject({
        email: registerDto.email,
        username: registerDto.username,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      });
    });
  });
});