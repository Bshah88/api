import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 13', description: 'The name of the product' })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'The latest iPhone with A15 Bionic chip and improved camera system',
        description: 'Product description (10-200 characters)'
    })
    @IsString()
    @MinLength(10)
    @MaxLength(200)
    desc: string;

    @ApiProperty({
        example: 'https://storage.googleapis.com/bucket-name/image.jpg',
        description: 'URL of the product image stored in Firebase'
    })
    @IsString()
    imageUrl: string;
} 