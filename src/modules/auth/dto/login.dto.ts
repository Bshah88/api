import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'john@example.com', description: 'The email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'The password of the user' })
    @IsString()
    @IsNotEmpty()
    password: string;
}   