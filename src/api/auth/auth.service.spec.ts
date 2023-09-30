import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
            getUserByUsername: jest.fn(),
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
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUserCredentials', () => {
    it('should return user by email if exists', async () => {
      const userMock = {
        _id: 'someUserId',
        email: 'test@example.com',
      };
      const loginDto: LoginUserDto = {
        emailOrUsername: 'test@example.com',
        password: 'password',
      };

      userService.getUserByEmail = jest.fn().mockResolvedValue(userMock);

      const result = await authService.validateUserCredentials(loginDto);

      expect(result).toEqual(userMock);
    });

    it('should return user by username if email not found', async () => {
      const userMock = {
        _id: 'someUserId',
        username: 'testuser',
      };
      const loginDto: LoginUserDto = {
        emailOrUsername: 'testuser',
        password: 'password',
      };

      userService.getUserByEmail = jest.fn().mockResolvedValue(null);
      userService.getUserByUsername = jest.fn().mockResolvedValue(userMock);

      const result = await authService.validateUserCredentials(loginDto);

      expect(result).toEqual(userMock);
    });

    it('should return null if neither email nor username is found', async () => {
      const loginDto: LoginUserDto = {
        emailOrUsername: 'nonexistent',
        password: 'password',
      };

      userService.getUserByEmail = jest.fn().mockResolvedValue(null);
      userService.getUserByUsername = jest.fn().mockResolvedValue(null);

      const result = await authService.validateUserCredentials(loginDto);

      expect(result).toBeNull();
    });
  });

  describe('loginWithCredentials', () => {
    it('should return access token if credentials are valid', async () => {
      const userMock = {
        _id: 'someUserId',
        password: bcrypt.hashSync('password', 10), // hashed password
      };
      const loginDto: LoginUserDto = {
        emailOrUsername: 'test@example.com',
        password: 'password',
      };

      authService.validateUserCredentials = jest.fn().mockResolvedValue(userMock);
      jwtService.sign = jest.fn().mockReturnValue('someAccessToken');

      const result = await authService.loginWithCredentials(loginDto);

      expect(result).toEqual({
        accessToken: 'someAccessToken',
      });
    });

    it('should throw a not found exception if user is not found', async () => {
      const loginDto: LoginUserDto = {
        emailOrUsername: 'nonexistent',
        password: 'password',
      };

      authService.validateUserCredentials = jest.fn().mockResolvedValue(null);

      await expect(authService.loginWithCredentials(loginDto)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND)
      );
    });

    it('should throw a bad request exception if password is incorrect', async () => {
      const userMock = {
        _id: 'someUserId',
        password: bcrypt.hashSync('correctPassword', 10),
      };
      const loginDto: LoginUserDto = {
        emailOrUsername: 'test@example.com',
        password: 'incorrectPassword',
      };

      authService.validateUserCredentials = jest.fn().mockResolvedValue(userMock);

      await expect(authService.loginWithCredentials(loginDto)).rejects.toThrow(
        new HttpException('Password incorrect', HttpStatus.BAD_REQUEST)
      );
    });
  });
});
