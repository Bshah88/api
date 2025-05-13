import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
    username: string;
    email: string;
    passwordHash: string;
    phone: string;
    isActive: boolean;
    fullName: string;
    refreshToken: string;
    role: string;
}


@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    username: string;

    @Prop()
    refreshToken: string;

    @Prop({ default: 'user' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
    this.username = this.email.split('@')[0];
    next();
});

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
        return returnedObject;
    },
});
