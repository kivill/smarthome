import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TriggersService } from './triggers.service';
import { TriggersController } from './triggers.controller';
import { JobController } from './jobs.controller';

import { Trigger, TriggerSchema } from './schemas/trigger.schema';
import { Job, JobSchema } from './schemas/job.schema';

import { Sensor, SensorSchema } from '../sensors/schemas/sensor.schema';
import { SensorReading, SensorReadingSchema } from '../sensors/schemas/sensor-readings.schema';

import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trigger.name, schema: TriggerSchema },
      { name: Job.name, schema: JobSchema },
      { name: Sensor.name, schema: SensorSchema },
      { name: SensorReading.name, schema: SensorReadingSchema },
    ]),
    ClientsModule.register([
      { name: 'esp32/output', transport: Transport.MQTT },
      { name: 'esp32/input', transport: Transport.MQTT},
    ]),
  ],
  controllers: [TriggersController, JobController],
  providers: [TriggersService],
  exports: [TriggersService]
})
export class TriggersModule {}
