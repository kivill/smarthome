import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Sensor } from './sensor.schema'

export type SensorReadingDocument = SensorReading & Document;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class SensorReading {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: [true, 'SENSOR_IS_BLANK']
    })
    sensorId: Sensor;

    @Prop({
        required: [true, 'READING_IS_BLANK']
    })
    reading: number;
}

export const SensorReadingSchema = SchemaFactory.createForClass(SensorReading);