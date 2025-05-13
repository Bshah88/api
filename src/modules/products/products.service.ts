import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
        const existingProduct = await this.findByName(createProductDto.name);
        if (existingProduct) {
            throw new BadRequestException('Product with this name already exists');
        }
        const newProduct = new this.productModel({ ...createProductDto, userId });
        return newProduct.save();
    }

    async findAll(page: number = 1, limit: number = 10, keyword?: string, startDate?: Date, endDate?: Date, userId?: string): Promise<{ total: number; data: Product[] }> {
        const query: any = { isDeleted: false };
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { desc: { $regex: keyword, $options: 'i' } },
            ];
        }
        if (startDate && endDate) {
            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        if (userId) {
            const user = await this.userModel.findById(userId);
            if (user.role !== 'admin') {
                query.userId = userId;
            }
        }
        const total = await this.productModel.countDocuments(query);
        const data = await this.productModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('userId', 'fullName role', this.userModel);
        return { total, data };
    }

    async findByName(name: string): Promise<Product> {
        const product = await this.productModel.findOne({ name, isDeleted: false });
        return product || null;
    }
    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findOne({ _id: id, isDeleted: false }).populate('userId', 'fullName');
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
        const product = await this.productModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateProductDto,
            { new: true },
        );
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async softDelete(id: string): Promise<Product> {
        const product = await this.productModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true },
        );
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }
} 