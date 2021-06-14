import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

import { SensorReading } from '../../sensors/schemas/sensor-readings.schema';

export type JobDocument = Job & Document;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Job {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SensorReading',
        required: [true, 'SENSOR_IS_BLANK']
    })
    sensorReadingId: SensorReading;

    @Prop({
        maxlength: 255,
        required: [true, 'ADDRESS_IS_BLANK']
    })
    type: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);