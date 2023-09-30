import { Controller, Post, Request, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('api')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async createUser(
        @Body() body: CreateUserDto
    ) {
        return this.userService.createUser(body);
    }
}
