import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorMessageDto } from './dto/sensor-message.dto'

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensor, SensorDocument } from './schemas/sensor.schema';
import { SensorReading, SensorReadingDocument } from './schemas/sensor-readings.schema';
import { GetSensorDataDto } from './dto/get-sensor-data.dto'


@Injectable()
export class SensorsService {
  constructor(
    @InjectModel(Sensor.name) private readonly sensorModel: Model<SensorDocument>,
    @InjectModel(SensorReading.name) private readonly sensorReadingModel: Model<SensorReadingDocument>,
  ) { }

  async findAll() {
    return await this.sensorModel.aggregate([
      { $lookup: {
        from: 'sensorreadings',
        as: 'readings',
        let: { sensorId: '$_id' },
        pipeline: [
          { $match: {
            $expr: { $eq: [ '$sensorId', '$$sensorId' ] }
          } },
          { $sort: { createdAt: 1 } },
          { $limit: 100 }
        ]
      } }
    ])
  }

  async findOne(data: GetSensorDataDto) {
    const sensor = await this.sensorModel.findOne({ sensorId: data.sensorId, deviceId: data.deviceId});
    if (!sensor) {
      throw new NotFoundException('Sensor not found.');
    }
    else {
      return sensor
    }
  }

  async getSensorData(data: SensorMessageDto) {
    console.log(data)
    const sensor = await this.sensorModel.findOne({ $and:[{sensorId: data.sensorId}, {deviceId: data.deviceId}] });
    if (!sensor) {
      await this.sensorModel.create(data)
    } else {
      await this.sensorReadingModel.create({sensorId: sensor, reading: data.value})
    }
  }
}
