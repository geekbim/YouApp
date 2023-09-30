import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUserCredentials(body: LoginUserDto): Promise<any> {
        let user = await this.userService.getUserByEmail(body.emailOrUsername);
        if (user) {
            return user
        }
        
        user = await this.userService.getUserByUsername(body.emailOrUsername);

        return user ?? null;
    }

    async loginWithCredentials(body: LoginUserDto) {
        const user = await this.validateUserCredentials(body);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid: boolean = bcrypt.compareSync(body.password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);
        }

        const payload = {
            id: user._id,
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
