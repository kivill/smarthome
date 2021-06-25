import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TriggersService } from './triggers.service';
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

@Controller('job')
@ApiTags('Job')
export class JobController {
  constructor(private readonly triggersService: TriggersService) {}
  @Get()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Список заданий', })
  @ApiCreatedResponse({})
  findAll() {
    return this.triggersService.findJobs();
  }
}
