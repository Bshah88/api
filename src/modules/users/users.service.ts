import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
// import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }
    async create(createUserDto: CreateUserDto): Promise<User> {
        // Check if this is the first user

        let role = 'user';
        const userCount = await this.userModel.countDocuments();
        if (userCount === 0) {
            role = 'admin';
        }
        const { password, ...rest } = createUserDto;
        // const salt = await bcrypt.genSalt();
        // const passwordHash = await bcrypt.hash(password, salt);
        const passwordHash = await argon2.hash(password);

        const newUser = new this.userModel({ ...rest, passwordHash, role });
        return newUser.save();
    }

    async findAll(page: number = 1, limit: number = 10, keyword?: string, startDate?: Date, endDate?: Date): Promise<{ total: number; data: User[] }> {
        const query: any = {};
        if (keyword) {
            query.$or = [
                { fullName: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
            ];
        }
        if (startDate && endDate) {
            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        const total = await this.userModel.countDocuments(query);
        const data = await this.userModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        return { total, data };
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email, isActive: true });
        return user || null;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async update(id: string, updateUserDto: Partial<User>): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async toggleActive(id: string): Promise<User> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.isActive = !user.isActive;
        return await this.update(id, user);
    }
} 