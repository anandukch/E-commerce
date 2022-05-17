import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';
import { STATUS } from 'src/shared/Enums';
import { Response } from 'src/shared/response';
import { CategoryDto } from './dto/category.dto';
import { SubCategoryDto } from './dto/sub-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(category: CategoryDto, user: any) {
    try {
      let sid = await this.categoryModel.countDocuments();
      const newCategory = new this.categoryModel({
        name: category.name,
        systemId: sid + 1,
        createdBy: user.systemId,
      });
      const createdCategory = await newCategory.save();
      return new Response({
        success: true,
        message: 'Category created successfully',
        data: {
          systemId: createdCategory.systemId,
          name: createdCategory.name,
          subCategories: createdCategory.subCategories,
          createdBy: createdCategory.createdBy,
          createdOn: createdCategory.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error creating category',
      });
    }
  }

  async getAllCategories() {
    try {
      const categories = await this.categoryModel.find({
        status: STATUS.ACTIVE,
      });
      return new Response({
        success: true,
        message: 'Categories fetched',
        data: categories.map((category) => {
          return {
            name: category.name,
            systemId: category.systemId,
            createdOn: category.createdOn,
            createdBy: category.createdBy,
            subCategories: category.subCategories,
          };
        }),
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error while fetching categories',
      });
    }
  }

  async getById(categoryId: number) {
    try {
      const category = await this.categoryModel.findOne({
        systemId: categoryId,
      });
      return new Response({
        success: true,
        message: 'Category fetched successfully',
        data: {
          systemId: category.systemId,
          name: category.name,
          subCategories: category.subCategories,
          createdBy: category.createdBy,
          createdOn: category.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error fetching category',
      });
    }
  }
  async disable(categoryId: number) {
    try {
      const category = await this.categoryModel.findOne({
        systemId: categoryId,
      });
      if (category.status === STATUS.DELETED) {
        return new Response({
          success: false,
          message: 'Deleted category cannot be disabled',
        });
      }
      category.status = STATUS.DISABLED;
      await category.save();
      return new Response({
        success: true,
        message: 'Category disabled successfully',
        data: {
          systemId: category.systemId,
          name: category.name,
          subCategories: category.subCategories,
          createdBy: category.createdBy,
          createdOn: category.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error disabling category',
      });
    }
  }

  async delete(categoryId: number) {
    try {
      const category = await this.categoryModel.findOne({
        systemId: categoryId,
      });
      category.status = STATUS.DELETED;
      await category.save();
      return new Response({
        success: true,
        message: 'Category deleted successfully',
        data: {
          systemId: category.systemId,
          name: category.name,
          subCategories: category.subCategories,
          createdBy: category.createdBy,
          createdOn: category.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error deleting category',
      });
    }
  }

  async createSubCategory(categoryId: number, subCategory: SubCategoryDto) {
    try {
      let category = await this.categoryModel.findOne({ systemId: categoryId });
      if (!category) {
        return new Response({
          success: false,
          message: 'Category not found',
        });
      }
      category.subCategories = category.subCategories.concat(
        subCategory.subCategories,
      );
      await category.save();
      return new Response({
        success: true,
        message: 'Sub-category created successfully',
        data: {
          systemId: category.systemId,
          name: category.name,
          subCategories: category.subCategories,
          createdBy: category.createdBy,
          createdOn: category.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error creating sub category',
      });
    }
  }
}
