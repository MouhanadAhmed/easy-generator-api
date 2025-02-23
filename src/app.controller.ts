import { Controller, Get } from '@nestjs/common';
import { SkipAuth } from './authorization/skip.auth.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @SkipAuth()
  getHello(): string {
    return 'Healthy';
  }
}
