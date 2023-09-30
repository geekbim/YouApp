import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { S3Service } from '../utils/s3.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserModel,
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
  ],
  providers: [UserService, JwtStrategy, S3Service],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
