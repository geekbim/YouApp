import { IsString, IsNumber } from 'class-validator';
import { genderType, horoscopeType, zodiacType } from '../userProfile/userProfile.enum';
import * as mongoose from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

export class UserProfileDto {
    userId: mongoose.Types.ObjectId;

    @IsString()
    @ApiProperty()
    image: string;

    @IsString()
    @ApiProperty()
    displayName: string;

    @IsString()
    @ApiProperty()
    gender: genderType;

    @ApiProperty()
    birthDate: Date;

    @IsString()
    @ApiProperty()
    horoscope: horoscopeType;

    @IsString()
    @ApiProperty()
    zodiac: zodiacType;

    @IsNumber()
    @ApiProperty()
    height: number;

    @IsNumber()
    @ApiProperty()
    weight: number;
    
    @ApiProperty()
    interest: string[];
}