import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  // Test data
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: '$2a$10$hashedpassword',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createUserDto = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  beforeEach(async () => {
    // Create testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Given: Valid user registration data
      const expectedToken = 'jwt-token';
      prismaService.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('$2a$10$hashedpassword');
      prismaService.user.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(expectedToken);

      // When: Registering the user
      const result = await authService.register(createUserDto);

      // Then: User should be created and token returned
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: '$2a$10$hashedpassword',
          name: createUserDto.name,
          role: 'USER',
        },
      });
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      // Given: User already exists
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // When & Then: Registration should fail
      await expect(authService.register(createUserDto)).rejects.toThrow(
        ConflictException
      );
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      // Given: Valid credentials and existing user
      const expectedToken = 'jwt-token';
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true);
      jwtService.sign.mockReturnValue(expectedToken);

      // When: Logging in
      const result = await authService.login(loginDto);

      // Then: Login should succeed
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password
      );
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
    });

    it('should throw UnauthorizedException with invalid email', async () => {
      // Given: User does not exist
      prismaService.user.findUnique.mockResolvedValue(null);

      // When & Then: Login should fail
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      // Given: User exists but password is wrong
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false);

      // When & Then: Login should fail
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('validateUser', () => {
    it('should return user data for valid user ID', async () => {
      // Given: Valid user exists
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // When: Validating user
      const result = await authService.validateUser(1);

      // Then: User data should be returned
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
    });

    it('should return null for non-existent user', async () => {
      // Given: User does not exist
      prismaService.user.findUnique.mockResolvedValue(null);

      // When: Validating user
      const result = await authService.validateUser(999);

      // Then: Should return null
      expect(result).toBeNull();
    });
  });
});