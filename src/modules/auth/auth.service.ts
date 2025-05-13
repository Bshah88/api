import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,

    ) { }

    async signup(createUserDto: CreateUserDto): Promise<any> {
        const userExists = await this.userService.findOneByEmail(createUserDto.email);
        if (userExists) {
            throw new UnauthorizedException('User already exists');
        }
        const newUser = await this.userService.create(createUserDto);
        const tokens = await this.getTokens(newUser._id as string, newUser.email, newUser.role);
        await this.updateRefreshToken(newUser._id as string, tokens.refreshToken);
        return tokens;
    }

    async login(email: string, password: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await argon2.verify(user.passwordHash, password);
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user._id as string, user.email, user.role);
        await this.updateRefreshToken(user._id as string, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: string) {
        return this.userService.update(userId, { refreshToken: null });
    }
    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(userId: string, email: string, role: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    role,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                    role,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userService.findOne(userId);
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await argon2.verify(
            user.refreshToken,
            refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user._id as string, user.email, user.role);
        await this.updateRefreshToken(user._id as string, tokens.refreshToken);
        return tokens;
    }
} 