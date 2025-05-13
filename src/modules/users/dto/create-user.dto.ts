import { IsString, IsEmail, Matches, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The full name of the user' })
    @IsString()
    fullName: string;

    @ApiProperty({ example: 'john@example.com', description: 'The email address of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '9876543210', description: 'The phone number of the user (10 digits starting with 6-9)' })
    @Matches(/^[6-9]\d{9}$/, { message: 'Phone number must be a valid 10-digit number starting with 6-9' })
    phone: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character'
    })
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message: 'Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    })
    password: string;
} 