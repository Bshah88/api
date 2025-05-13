import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];
        const decoded = this.jwtService.decode(token) as { role: string };
        return decoded && roles.includes(decoded.role);
    }
}
