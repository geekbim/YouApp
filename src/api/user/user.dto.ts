import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';
import { Trim } from "class-sanitizer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @Trim()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    username: string;

    @IsString()
    @MinLength(8)
    @ApiProperty()
    password: string;

    @IsString()
    @ApiProperty()
    passwordConfirmation: string;
}