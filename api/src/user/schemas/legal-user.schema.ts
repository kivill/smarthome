import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    versionKey: false,
})
export class LegalUser {
    _id: MongooseSchema.Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    roles: string;

    @Prop({
        required: [true, 'ADRESS_IS_BLANK']
    })
    legalAdress: string;
}

export const LegalUserSchema = SchemaFactory.createForClass(LegalUser);
