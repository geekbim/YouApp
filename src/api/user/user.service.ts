import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ){}

    async createUser(body: CreateUserDto): Promise<any> {
        const { email, username, password, passwordConfirmation }: CreateUserDto = body;

        let user: User = await this.userModel.findOne({ email });
        if (user) {
            throw new HttpException('Conflict', HttpStatus.CONFLICT);
        }

        if (password != passwordConfirmation) {
            throw new HttpException('Password not match', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            user = await this.userModel.create({
                email,
                username,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

        const payload = {
            id: user._id,
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.userModel.findOne({ username });
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email });
    }
}