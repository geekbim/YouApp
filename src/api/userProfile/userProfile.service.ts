import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { UserProfile } from './userProfile.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserProfileDto } from './userProfile.dto';
import { S3Service } from '../utils/s3.helper';

@Injectable()
export class UserProfileService {
    constructor(
        @InjectModel('UserProfile')
        private readonly userProfileModel: Model<UserProfile>,
        private readonly s3Service: S3Service,
    ){}

    async createProfile(body: UserProfileDto): Promise<UserProfile> {
        const { userId, image, displayName, gender, birthDate, horoscope, zodiac, height, weight, interest }: UserProfileDto = body;
        let imageLocation: string = '';

        let userProfile: UserProfile = await this.userProfileModel.findOne({ userId: userId });
        if (userProfile) {
            throw new HttpException('Conflict', HttpStatus.BAD_REQUEST);
        }

        if (image != '') {
            imageLocation = await this.s3Service.uploadBase64Image(image);
        }

        const randomObjectId = new mongoose.Types.ObjectId();
        const newUserProfile: UserProfile = {
            id: randomObjectId,
            userId,
            image: imageLocation,
            displayName,
            gender,
            birthDate,
            horoscope,
            zodiac,
            height,
            weight,
            interest,
        };

        const res: UserProfile = await this.userProfileModel.create(newUserProfile);

        return res;
    }

    async getProfile(userId: mongoose.Types.ObjectId): Promise<UserProfile> {
        let userProfile: UserProfile = await this.userProfileModel.findOne({ userId });
        if (!userProfile) {
            throw new HttpException('User profile not found', HttpStatus.NOT_FOUND);
        }

        return userProfile;
    }

    async updateProfile(body: UserProfileDto): Promise<UserProfile> {
        const { userId, image, displayName, gender, birthDate, horoscope, zodiac, height, weight, interest }: UserProfileDto = body;
        let imageLocation: string = '';

        let userProfile: UserProfile = await this.userProfileModel.findOne({ userId: userId });
        if (!userProfile) {
            await this.createProfile(body);
        }

        if (image != '') {
            imageLocation = await this.s3Service.uploadBase64Image(image);
        } else {
            imageLocation = userProfile.image
        }

        const newUserProfile: UserProfile = {
            id: userProfile.id,
            userId,
            image: imageLocation,
            displayName,
            gender,
            birthDate,
            horoscope,
            zodiac,
            height,
            weight,
            interest,
        };

        await this.userProfileModel.findByIdAndUpdate(userProfile.id, newUserProfile);

        return newUserProfile;
    }
}