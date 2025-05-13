import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
    @ApiProperty({ example: 1, description: 'Page number for pagination' })
    page: number = 1;

    @ApiProperty({ example: 10, description: 'Limit of items per page' })
    limit: number = 10;

    @ApiProperty({ example: 'search keyword', description: 'Keyword for searching items' })
    @IsString()
    keyword?: string;

    @ApiProperty({ example: '2023-01-01', description: 'Start date for filtering' })
    startDate?: Date;

    @ApiProperty({ example: '2023-12-31', description: 'End date for filtering' })
    endDate?: Date;
} 