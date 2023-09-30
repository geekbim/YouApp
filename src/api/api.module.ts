import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './userProfile/userProfile.module';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    UserProfileModule,
  ]
})
export class ApiModule {}