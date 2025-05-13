import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('products')
@UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @UseGuards(AccessTokenGuard)
    @Post()
    @Roles('admin', 'user')
    async create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
        return this.productsService.create(createProductDto, req.user.id);
    }

    @ApiOperation({ summary: 'Get all products with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'keyword', required: false, type: String })
    @ApiQuery({ name: 'startDate', required: false, type: Date })
    @ApiQuery({ name: 'endDate', required: false, type: Date })
    @ApiResponse({ status: 200, description: 'Return list of products' })
    @UseGuards(AccessTokenGuard)
    @Get()
    @Roles('admin', 'user')
    async findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('keyword') keyword: string,
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date, @Request() req: any
    ) {
        return this.productsService.findAll(page, limit, keyword, startDate, endDate, req.user.id);
    }

    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Return product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @UseGuards(AccessTokenGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update product details' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @UseGuards(AccessTokenGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
        return this.productsService.update(id, updateProductDto);
    }

    @ApiOperation({ summary: 'Soft delete a product' })
    @ApiResponse({ status: 200, description: 'Product soft deleted successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    async softDelete(@Param('id') id: string) {
        return this.productsService.softDelete(id);
    }
} 