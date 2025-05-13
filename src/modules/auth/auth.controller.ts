import { Controller, Post, Body, UseGuards, Request, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';

export interface AuthenticatedRequest extends Request {
    user: any;
}
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @ApiOperation({ summary: 'Logout a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged out.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(@Req() req: AuthenticatedRequest) {
        this.authService.logout(req.user['sub']);
    }

    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UseGuards(AccessTokenGuard)
    @Post('me')
    getProfile(@Request() req: AuthenticatedRequest) {
        return req.user;
    }

    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: AuthenticatedRequest) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}

