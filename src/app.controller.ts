import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { Roles } from './auth/roles/roles.decorator';
import { RolesGuard } from './auth/roles/roles.guard';
import { ROLES } from './shared/Enums';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/refresh')
  async seedTransaction() {
    await this.appService.seedDatabase();
  }
}
