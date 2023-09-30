import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { LoginUserDto } from "src/api/auth/auth.dto";
import { AuthService } from "src/api/auth/auth.service";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(body: LoginUserDto): Promise<any> {
        const user = await this.authService.validateUserCredentials(body);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid: boolean = bcrypt.compareSync(body.password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);
        }

        return user;
    }
}