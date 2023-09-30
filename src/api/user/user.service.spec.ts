import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userModelMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    userModelMock = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: userModelMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        passwordConfirmation: 'password',
      };

      userModelMock.findOne.mockResolvedValue(null);
      userModelMock.create.mockResolvedValue({
        _id: 'someUserId',
      });
      jwtServiceMock.sign.mockReturnValue('someAccessToken');
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual({
        accessToken: 'someAccessToken',
      });
    });

    it('should throw a conflict exception if the user already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        passwordConfirmation: 'password',
      };

      userModelMock.findOne.mockResolvedValue({
        _id: 'someUserId',
      });

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Conflict', HttpStatus.CONFLICT)
      );
    });

    it('should throw a bad request exception if the password and confirmation do not match', async () => {
      const createUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        passwordConfirmation: 'differentPassword',
      };

      userModelMock.findOne.mockResolvedValue(null);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        new HttpException('Password not match', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const userMock = {
        _id: 'someUserId',
        username: 'testuser',
        email: 'test@example.com',
      };

      userModelMock.findOne.mockResolvedValue(userMock);

      const result = await userService.getUserByUsername(username);

      expect(result).toEqual(userMock);
    });

    it('should return null if the user does not exist', async () => {
      const username = 'nonexistentuser';

      userModelMock.findOne.mockResolvedValue(null);

      const result = await userService.getUserByUsername(username);

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const userMock = {
        _id: 'someUserId',
        username: 'testuser',
        email: 'test@example.com',
      };

      userModelMock.findOne.mockResolvedValue(userMock);

      const result = await userService.getUserByEmail(email);

      expect(result).toEqual(userMock);
    });

    it('should return null if the user does not exist', async () => {
      const email = 'nonexistent@example.com';

      userModelMock.findOne.mockResolvedValue(null);

      const result = await userService.getUserByEmail(email);

      expect(result).toBeNull();
    });
  });
});
