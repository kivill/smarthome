import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

export type SensorDocument = Sensor & Document;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Sensor {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        minlength: 6,
        maxlength: 255,
        required: [true, 'NAME_IS_BLANK']
    })
    deviceId: string;

    @Prop({
        maxlength: 255,
        required: [true, 'ADDRESS_IS_BLANK']
    })
    sensorId: string;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);