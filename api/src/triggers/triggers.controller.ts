import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { CreateTriggerDto } from './dto/create-trigger.dto';
import { UpdateTriggerDto } from './dto/update-trigger.dto';
import { SensorMessageDto } from '../sensors/dto/sensor-message.dto'
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

@ApiTags('Trigger')
@Controller('triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Добавление триггера', })
  create(@Body() createTriggerDto: CreateTriggerDto) {
    return this.triggersService.create(createTriggerDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение списка триггеров', })
  @ApiOkResponse({})
  findAll() {
    return this.triggersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение информации о конкретном триггере', })
  @ApiOkResponse({})
  findOne(@Param('id') id: string) {
    return this.triggersService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Обновление триггера триггеров', })
  @ApiOkResponse({})
  update(@Param('id') id: string, @Body() updateTriggerDto: UpdateTriggerDto) {
    return this.triggersService.update(id, updateTriggerDto);
  }

  @MessagePattern('esp32/output')
  accumulate(data: SensorMessageDto) {
    this.triggersService.checkTrigger(data);
  }
}
