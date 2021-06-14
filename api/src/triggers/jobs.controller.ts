import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TriggersService } from './triggers.service';

import { MessagePattern } from '@nestjs/microservices';

@Controller('job')
export class JobController {
  constructor(private readonly triggersService: TriggersService) {}
  @Get()
  findAll() {
    return this.triggersService.findJobs();
  }
}
