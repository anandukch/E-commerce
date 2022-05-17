import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ROLES } from 'src/shared/Enums';
import { CreateQueryDto } from './dto/create-query.dto';
import { QueryService } from './query.service';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryResponseDto } from './dto/query-response.dto';

@ApiTags('Query')
@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Query Created',
    type: QueryResponseDto,
  })
  async createQuery(@Body() query: CreateQueryDto, @Req() req: Request) {
    return await this.queryService.create(query, req.user);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Query fetched',
    type: QueryResponseDto,
  })
  async getAllQueries() {
    return this.queryService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:queryId/resolve')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Query resolved',
    type: QueryResponseDto,
  })
  async resolveQuery(@Param('queryId') queryId: number, @Req() req: Request) {
    return this.queryService.resolve(queryId, req.user);
  }
}
