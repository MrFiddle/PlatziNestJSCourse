import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { AnyShort } from 'src/general_dtos/AnyShort';
import { Post } from '../entities/post.entity';
import { ShortPostResponseDto } from '../dto/short-post-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new BadRequestException('Failed to create category');
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return plainToInstance(AnyShort, categories, { excludeExtraneousValues: true });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id);
      const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
      return await this.categoryRepository.save(updatedCategory);
    } catch {
      throw new BadRequestException('Failed to update category');
    }
  }

  async delete(id: number): Promise<{ deleted: boolean }> {
    try {
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete category');
    }
  }
}
