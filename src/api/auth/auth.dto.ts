import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { Trim } from "class-sanitizer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @Trim()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    emailOrUsername: string;

    @IsString()
    @MinLength(8)
    @ApiProperty()
    password: string;
}

