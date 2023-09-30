import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { ApiModule } from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath, 
      isGlobal: true 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGODB_URI'), 
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService], 
    }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}