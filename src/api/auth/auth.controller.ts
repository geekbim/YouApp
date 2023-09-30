import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "src/api/auth/auth.service";
import { LoginUserDto } from "./auth.dto";

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() body: LoginUserDto
    ) {
        return this.authService.loginWithCredentials(body);
    }
}