import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { CreateTriggerDto } from './dto/create-trigger.dto';
import { UpdateTriggerDto } from './dto/update-trigger.dto';
import { SensorMessageDto } from '../sensors/dto/sensor-message.dto'

import { MessagePattern } from '@nestjs/microservices';

@Controller('triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @Post()
  create(@Body() createTriggerDto: CreateTriggerDto) {
    return this.triggersService.create(createTriggerDto);
  }

  @Get()
  findAll() {
    return this.triggersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.triggersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTriggerDto: UpdateTriggerDto) {
    return this.triggersService.update(id, updateTriggerDto);
  }

  @MessagePattern('esp32/output')
  accumulate(data: SensorMessageDto) {
    this.triggersService.checkTrigger(data);
  }
}
