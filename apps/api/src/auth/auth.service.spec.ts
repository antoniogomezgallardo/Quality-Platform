import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Create a mock PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: typeof mockPrismaService;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword123',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUserWithoutPassword = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      // Given
      const email = 'test@example.com';
      const password = 'password123';

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // When
      const result = await service.validateUser(email, password);

      // Then
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual(mockUserWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user does not exist', async () => {
      // Given
      const email = 'nonexistent@example.com';
      const password = 'password123';

      prismaService.user.findUnique.mockResolvedValue(null);

      // When
      const result = await service.validateUser(email, password);

      // Then
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      // Given
      const email = 'test@example.com';
      const password = 'wrongpassword';

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // When
      const result = await service.validateUser(email, password);

      // Then
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return access token and user data when credentials are valid', async () => {
      // Given
      const mockToken = 'mock-jwt-token';
      const expectedPayload = {
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUserWithoutPassword);
      jwtService.sign.mockReturnValue(mockToken);

      // When
      const result = await service.login(loginDto);

      // Then
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
        },
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      // Given
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      // When & Then
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    };

    it('should register new user and return access token', async () => {
      // Given
      const hashedPassword = 'hashedPassword123';
      const mockToken = 'mock-jwt-token';
      const newUser = { ...mockUser, ...registerDto, password: hashedPassword };
      const expectedPayload = {
        email: newUser.email,
        sub: newUser.id,
        role: newUser.role
      };

      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      prismaService.user.create.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue(mockToken);

      // When
      const result = await service.register(registerDto);

      // Then
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: registerDto.email },
            { username: registerDto.username },
          ],
        },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          username: registerDto.username,
          password: hashedPassword,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
    });

    it('should throw UnauthorizedException when email already exists', async () => {
      // Given
      const existingUser = { ...mockUser, email: registerDto.email };
      prismaService.user.findFirst.mockResolvedValue(existingUser);

      // When & Then
      await expect(service.register(registerDto)).rejects.toThrow(
        new UnauthorizedException('User with this email or username already exists')
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: registerDto.email },
            { username: registerDto.username },
          ],
        },
      });
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(prismaService.user.create).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when username already exists', async () => {
      // Given
      const existingUser = { ...mockUser, username: registerDto.username };
      prismaService.user.findFirst.mockResolvedValue(existingUser);

      // When & Then
      await expect(service.register(registerDto)).rejects.toThrow(
        new UnauthorizedException('User with this email or username already exists')
      );
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: registerDto.email },
            { username: registerDto.username },
          ],
        },
      });
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(prismaService.user.create).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should register user with minimal data when optional fields are not provided', async () => {
      // Given
      const minimalRegisterDto = {
        email: 'minimal@example.com',
        username: 'minimal',
        password: 'password123',
      };
      const hashedPassword = 'hashedPassword123';
      const mockToken = 'mock-jwt-token';
      const newUser = {
        ...mockUser,
        ...minimalRegisterDto,
        password: hashedPassword,
        firstName: null,
        lastName: null,
      };

      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      prismaService.user.create.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue(mockToken);

      // When
      const result = await service.register(minimalRegisterDto);

      // Then
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: minimalRegisterDto.email,
          username: minimalRegisterDto.username,
          password: hashedPassword,
          firstName: undefined,
          lastName: undefined,
        },
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
    });
  });

  describe('getUserById', () => {
    it('should return user data when user exists', async () => {
      // Given
      const userId = 1;
      const expectedUser = mockUserWithoutPassword;

      prismaService.user.findUnique.mockResolvedValue(expectedUser);

      // When
      const result = await service.getUserById(userId);

      // Then
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Given
      const userId = 999;
      prismaService.user.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.getUserById(userId)).rejects.toThrow(
        new UnauthorizedException('User not found')
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully in validateUser', async () => {
      // Given
      const email = 'test@example.com';
      const password = 'password123';
      const dbError = new Error('Database connection failed');

      prismaService.user.findUnique.mockRejectedValue(dbError);

      // When & Then
      await expect(service.validateUser(email, password)).rejects.toThrow(dbError);
    });

    it('should handle bcrypt errors gracefully in register', async () => {
      // Given
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      const hashError = new Error('Hash function failed');

      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockRejectedValue(hashError as never);

      // When & Then
      await expect(service.register(registerDto)).rejects.toThrow(hashError);
    });

    it('should handle JWT signing errors gracefully in login', async () => {
      // Given
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const jwtError = new Error('JWT signing failed');

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUserWithoutPassword);
      jwtService.sign.mockImplementation(() => {
        throw jwtError;
      });

      // When & Then
      await expect(service.login(loginDto)).rejects.toThrow(jwtError);
    });
  });
});