import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateTriggerDto } from './dto/create-trigger.dto';
import { UpdateTriggerDto } from './dto/update-trigger.dto';
import { SensorMessageDto } from '../sensors/dto/sensor-message.dto'

import { ClientProxy } from '@nestjs/microservices';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trigger, TriggerDocument } from './schemas/trigger.schema';
import { Job, JobDocument } from './schemas/job.schema';
import { Sensor, SensorDocument } from '../sensors/schemas/sensor.schema';
import { SensorReading, SensorReadingDocument } from '../sensors/schemas/sensor-readings.schema';

@Injectable()
export class TriggersService {
  constructor(
    @Inject('esp32/input') private client: ClientProxy,
    @InjectModel(Trigger.name) private readonly triggerModel: Model<TriggerDocument>,
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(Sensor.name) private readonly sensorModel: Model<SensorDocument>,
    @InjectModel(SensorReading.name) private readonly sensorReadingModel: Model<SensorReadingDocument>,
  ) {
  }
  async create(createTriggerDto: CreateTriggerDto) {
    const trigger = new this.triggerModel(createTriggerDto);
    return await trigger.save();
  }

  async findAll() {
    return await this.triggerModel.find().populate('sensorId', { _id: 1, deviceId: 1, sensorId: 1 });
  }

  async findJobs() {
    return await this.jobModel.find().populate('sensorReadingId');
  }

  async findOne(id: string) {
    const trigger = await this.triggerModel.findOne({ _id: id })
    console.log(trigger);
    if (!trigger) {
      throw new NotFoundException('Trigger not found.');
    }
    return trigger;
  }

  async update(id: string, updateTriggerDto: UpdateTriggerDto) {
    const trigger = await this.triggerModel.findOne({ _id: id })
    if (!trigger) {
      throw new NotFoundException('Trigger not found.');
    }
    return await this.triggerModel.findByIdAndUpdate(id, {$set: updateTriggerDto}, {
      useFindAndModify: true, new: true
    });
  }

  async checkTrigger(data: SensorMessageDto) {
    console.log(data)
    const sensor = await this.sensorModel.findOne({ $and:[{sensorId: data.sensorId}, {deviceId: data.deviceId}] });
    if (!sensor) {
      await this.sensorModel.create(data)
    } else {
      const sensorReading = await this.sensorReadingModel.create({sensorId: sensor, reading: data.value})
      const triggers = await this.triggerModel.find({sensorId: sensor});
      for (const trigger of triggers) {
        for (const confine of trigger.confines) {
          if (confine.confine == '>' && data.value > confine.value) {
            this.doJob(trigger, sensorReading)
          }
          if (confine.confine == '<' && data.value < confine.value) {
            this.doJob(trigger, sensorReading)
          }
        }
      }
    }
  }

  async doJob(trigger: Trigger, sensorReading: SensorReading) {
    for (const job of trigger.jobs) {
      if (job.jobType == 'light') {
        this.client.emit('esp32/input', {
          deviceId: 'ESP32_2',
          sensorId: 'light',
          value: Number.parseInt(job.jobInfo.toString())
        })
        await  this.jobModel.create({sensorReadingId: sensorReading, type: job.jobType})
      }
      if (job.jobType == 'squeaker') {
        this.client.emit('esp32/input', {
          deviceId: 'ESP32_1',
          sensorId: 'squeaker',
          value: Number.parseInt(job.jobInfo.toString())
        })
        await  this.jobModel.create({sensorReadingId: sensorReading, type: job.jobType})
      } 
    }
  }
}
