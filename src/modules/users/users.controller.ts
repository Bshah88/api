import { Controller, Get, Put, Param, Body, Query, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
@ApiTags('users')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @UseGuards(AccessTokenGuard)
    @Post()
    @Roles('admin')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }


    @ApiOperation({ summary: 'Get all users with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'keyword', required: false, type: String })
    @ApiQuery({ name: 'startDate', required: false, type: Date })
    @ApiQuery({ name: 'endDate', required: false, type: Date })
    @ApiResponse({ status: 200, description: 'Return list of users' })
    @UseGuards(AccessTokenGuard)
    @Get()
    @Roles('admin')
    async findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('keyword') keyword: string,
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date,
    ) {
        return await this.usersService.findAll(page, limit, keyword, startDate, endDate);
    }

    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'Return user details' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(':id')
    @Roles('admin', 'user')
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id);
    }

    @ApiOperation({ summary: 'Update user details' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(AccessTokenGuard)
    @Put(':id')
    @Roles('admin')
    async update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
        return await this.usersService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Toggle user active status' })
    @ApiResponse({ status: 200, description: 'User status toggled successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(AccessTokenGuard)
    @Put(':id/toggle-active')
    @Roles('admin')
    async toggleActive(@Param('id') id: string) {
        return await this.usersService.toggleActive(id);
    }
} 