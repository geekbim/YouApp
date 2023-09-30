import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { UserProfileService } from './userProfile.service';
import { UserProfile } from './userProfile.entity';
import { UserProfileDto } from './userProfile.dto';
import { genderType, horoscopeType, zodiacType } from './userProfile.enum';
import { S3Service } from '../utils/s3.helper';

describe('UserProfileService', () => {
  let userProfileService: UserProfileService;
  let userProfileModelMock: any;
  let s3ServiceMock: any;

  beforeEach(async () => {
    userProfileModelMock = {
        findOne: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    s3ServiceMock = {
        uploadBase64Image: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserProfileService,
          {
            provide: getModelToken('UserProfile'),
            useValue: userProfileModelMock,
          },
          {
            provide: S3Service,
            useValue: s3ServiceMock,
          },
        ],
    }).compile();

    userProfileService = module.get<UserProfileService>(UserProfileService);
  });

  it('should be defined', () => {
    expect(userProfileService).toBeDefined();
  });

  describe('createProfile', () => {
    it('should create a user profile', async () => {
      const body: UserProfileDto = {
        userId: new mongoose.Types.ObjectId(),
        image: "",
        displayName: "test display",
        gender: genderType.Male,
        birthDate: new Date(),
        horoscope: horoscopeType.Aquarius,
        zodiac: zodiacType.Dog,
        height: 50,
        weight: 60,
        interest: ["playing games"],
      };

      userProfileModelMock.findOne.mockResolvedValue(null);
      s3ServiceMock.uploadBase64Image.mockResolvedValue('imageLocation');
      userProfileModelMock.create.mockResolvedValue(body);

      const result = await userProfileService.createProfile(body);

      expect(result).toEqual(body);
    });

    it('should throw a conflict exception if user profile already exists', async () => {
      const body: UserProfileDto = {
        userId: new mongoose.Types.ObjectId(),
        image: "",
        displayName: "test display",
        gender: genderType.Male,
        birthDate: new Date(),
        horoscope: horoscopeType.Aquarius,
        zodiac: zodiacType.Dog,
        height: 50,
        weight: 60,
        interest: ["playing games"],
      };

      userProfileModelMock.findOne.mockResolvedValue(body);

      await expect(userProfileService.createProfile(body)).rejects.toThrow(
        new HttpException('Conflict', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('getProfile', () => {
    it('should return a user profile by userId', async () => {
      const userProfileMock: UserProfile = {
        id:  new mongoose.Types.ObjectId(),
        userId:  new mongoose.Types.ObjectId(),
        image: "",
        displayName: "test display",
        gender: genderType.Male,
        birthDate: new Date(),
        horoscope: horoscopeType.Aquarius,
        zodiac: zodiacType.Dog,
        height: 50,
        weight: 60,
        interest: ["playing games"],
      };

      userProfileModelMock.findOne.mockResolvedValue(userProfileMock);

      const result = await userProfileService.getProfile(userProfileMock.userId);

      expect(result).toEqual(userProfileMock);
    });

    it('should throw a not found exception if user profile is not found', async () => {
      const userId = new mongoose.Types.ObjectId();

      userProfileModelMock.findOne.mockResolvedValue(null);

      await expect(userProfileService.getProfile(userId)).rejects.toThrow(
        new HttpException('User profile not found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('updateProfile', () => {
    it('should update a user profile', async () => {
      const body: UserProfileDto = {
        userId: new mongoose.Types.ObjectId(),
        image: "",
        displayName: "test display",
        gender: genderType.Male,
        birthDate: new Date(),
        horoscope: horoscopeType.Aquarius,
        zodiac: zodiacType.Dog,
        height: 50,
        weight: 60,
        interest: ["playing games"],
      };

      userProfileModelMock.findOne.mockResolvedValue(body);
      s3ServiceMock.uploadBase64Image.mockResolvedValue('imageLocation');
      userProfileModelMock.findByIdAndUpdate.mockResolvedValue(body);

      const result = await userProfileService.updateProfile(body);

      expect(result).toEqual(body);
    });

    it('should create a user profile if it does not exist and then update it', async () => {
      const body: UserProfileDto = {
        userId: new mongoose.Types.ObjectId(),
        image: "",
        displayName: "test display",
        gender: genderType.Male,
        birthDate: new Date(),
        horoscope: horoscopeType.Aquarius,
        zodiac: zodiacType.Dog,
        height: 50,
        weight: 60,
        interest: ["playing games"],
      };

      userProfileModelMock.findOne.mockResolvedValue(body);
      userProfileModelMock.create.mockResolvedValue(body);
      s3ServiceMock.uploadBase64Image.mockResolvedValue('imageLocation');
      userProfileModelMock.findByIdAndUpdate.mockResolvedValue(body);

      const result = await userProfileService.updateProfile(body);

      expect(result).toEqual(body);
    });
  });
});
