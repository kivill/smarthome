import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';

import { Sensor, SensorSchema } from './schemas/sensor.schema';
import { SensorReading, SensorReadingSchema } from './schemas/sensor-readings.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TriggersService } from "../triggers/triggers.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sensor.name, schema: SensorSchema },
      { name: SensorReading.name, schema: SensorReadingSchema },
    ]),
    ClientsModule.register([
      { name: 'esp32/output', transport: Transport.MQTT },
    ]),
  ],
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class SensorsModule {}
