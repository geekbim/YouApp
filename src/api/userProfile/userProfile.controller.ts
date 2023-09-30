import { Controller, Post, Request, Body, HttpCode, HttpStatus, UseGuards, Put, Get } from '@nestjs/common';
import { UserProfileService } from './userProfile.service';
import { UserProfileDto } from './userProfile.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('api')
@ApiBearerAuth('JWT-auth')
export class UserProfileController {
    constructor(
        private readonly userProfileService: UserProfileService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('createProfile')
    @HttpCode(HttpStatus.CREATED)
    async createProfile(
        @Body() body: UserProfileDto,
        @Request() req,
    ) {
        body.userId = req.user.id;
        return this.userProfileService.createProfile(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('getProfile')
    @HttpCode(HttpStatus.OK)
    async getProfile(
        @Request() req,
    ) {
        return this.userProfileService.getProfile(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('updateProfile')
    @HttpCode(HttpStatus.OK)
    async updateProfile(
        @Body() body: UserProfileDto,
        @Request() req,
    ) {
        body.userId = req.user.id;
        return this.userProfileService.updateProfile(body);
    }
}
