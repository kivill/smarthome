import { Controller, Get, Post, Body, Put, Param, Query, Delete } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorMessageDto } from './dto/sensor-message.dto'
import { GetSensorDataDto } from './dto/get-sensor-data.dto'


import { MessagePattern } from '@nestjs/microservices';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  findAll() {
    return this.sensorsService.findAll();
  }

  @Get(':id')
  findOne(@Query() GetSensorDataDto: GetSensorDataDto) {
    return this.sensorsService.findOne(GetSensorDataDto);
  }

  @MessagePattern('esp32/output')
  accumulate(data: SensorMessageDto) {
    this.sensorsService.getSensorData(data);
  }
}
