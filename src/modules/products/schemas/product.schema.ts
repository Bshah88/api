import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, minlength: 10, maxlength: 200 })
    desc: string;

    @Prop({ required: true })
    imageUrl: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 