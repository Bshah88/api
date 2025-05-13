import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [AuthService,
        UsersService,
        AccessTokenStrategy, RefreshTokenStrategy

    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { } 