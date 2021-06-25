import { Controller, Get, Post, Body, Put, Param, Query, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorMessageDto } from './dto/sensor-message.dto'
import { GetSensorDataDto } from './dto/get-sensor-data.dto'
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiBearerAuth,
    ApiHeader,
    ApiOperation,
    ApiParam
} from '@nestjs/swagger';

import { MessagePattern } from '@nestjs/microservices';

@ApiTags('Sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение показаний', })
  @ApiOkResponse({})
  findAll() {
    return this.sensorsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение показаний по конкретному сенсору', })
  findOne(@Query() GetSensorDataDto: GetSensorDataDto) {
    return this.sensorsService.findOne(GetSensorDataDto);
  }

  @MessagePattern('esp32/output')
  accumulate(data: SensorMessageDto) {
    this.sensorsService.getSensorData(data);
  }
}
