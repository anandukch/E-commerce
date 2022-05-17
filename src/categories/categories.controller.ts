import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ROLES } from 'src/shared/Enums';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryDto } from './dto/category.dto';
import { SubCategoryDto } from './dto/sub-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories created',
    type: CategoryResponseDto,
  })
  async createCategory(@Body() category: CategoryDto, @Req() req: Request) {
    return await this.categoryService.create(category, req?.user);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories fetched',
    type: [CategoryResponseDto],
  })
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:categoryId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories fetched',
    type: CategoryResponseDto,
  })
  async getCategory(@Param('categoryId') categoryId: number) {
    return await this.categoryService.getById(categoryId);
  }
  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:categoryId/disable')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories disabled',
    type: CategoryResponseDto,
  })
  async disableCategory(@Param('categoryId') categoryId: number) {
    return await this.categoryService.disable(categoryId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:categoryId/delete')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories deleted',
    type: CategoryResponseDto,
  })
  async deleteCategory(@Param('categoryId') categoryId: number) {
    return await this.categoryService.delete(categoryId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:categoryId/sub-categories')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Sub-Categories added',
    type: CategoryResponseDto,
  })
  async addSubCategory(
    @Param('categoryId') categoryId: number,
    @Body() subCategory: SubCategoryDto,
  ) {
    return await this.categoryService.createSubCategory(
      categoryId,
      subCategory,
    );
  }
}
