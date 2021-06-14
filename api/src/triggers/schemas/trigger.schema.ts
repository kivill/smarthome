import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

import { Sensor } from '../../sensors/schemas/sensor.schema';

export type TriggerDocument = Trigger & Document;

@Schema()
export class Confines extends Document{
  @Prop()
  confine: String;

  @Prop()
  value: number;
}
export const ConfinesSchema = SchemaFactory.createForClass(Confines);

@Schema()
export class Job extends Document {
  @Prop()
  jobType: String;

  @Prop()
  jobInfo: String;
}
export const JobSchema = SchemaFactory.createForClass(Job);

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Trigger {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: [true, 'SENSOR_IS_BLANK']
    })
    sensorId: Sensor;

    @Prop({ type: [ConfinesSchema], default: [] })
    confines: Confines[];

    @Prop({ type: [JobSchema], default: [] })
    jobs: Job[];
}

export const TriggerSchema = SchemaFactory.createForClass(Trigger);