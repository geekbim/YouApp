import { Module } from '@nestjs/common';
import { UserProfileService } from './userProfile.service';
import { UserProfileController } from './userProfile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfileModel } from './userProfile.model';
import { PassportModule } from '@nestjs/passport';
import { S3Service } from '../utils/s3.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserProfile',
        schema: UserProfileModel,
      },
    ]),
    PassportModule,
  ],
  providers: [UserProfileService, S3Service],
  controllers: [UserProfileController],
  exports: [UserProfileService],
})
export class UserProfileModule {}
