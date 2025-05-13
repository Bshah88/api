import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './modules/common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    MongooseModule.forRoot(process.env.MONGODB_URI,),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    FirebaseModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100
        }
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: 'THROTTLE_GUARD',
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule { }
