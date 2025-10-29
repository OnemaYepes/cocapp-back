import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  async create(userId: string, dto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipeRepo.create({
      userId,
      name: dto.name,
      duration: dto.duration,
      portionSize: dto.portionSize,
      mealType: dto.mealType,
      instructions: dto.instructions,
    });

    if (dto.ingredients && dto.ingredients.length) {
      recipe.ingredients = this.ingredientRepo.create(dto.ingredients as any);
    }

    return this.recipeRepo.save(recipe);
  }

  async findByUser(userId: string): Promise<Recipe[]> {
    return this.recipeRepo.find({ where: { userId }, order: { createdAt: 'DESC' }, relations: ['ingredients'] });
  }

  async findByUserPaged(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.recipeRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['ingredients'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findOneForUser(id: string, userId: string): Promise<Recipe> {
    const recipe = await this.recipeRepo.findOne({ where: { id, userId }, relations: ['ingredients'] });
    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }

  async search(userId: string, q: string): Promise<Recipe[]> {
    if (!q || q.trim() === '') return this.findByUser(userId);
    return this.recipeRepo.find({
      where: [
        { userId, name: ILike(`%${q}%`) },
        { userId, instructions: ILike(`%${q}%`) },
      ],
      relations: ['ingredients'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, userId: string, dto: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.findOneForUser(id, userId);

    if (dto.name !== undefined) recipe.name = dto.name;
    if (dto.mealType !== undefined) recipe.mealType = dto.mealType;
    if (dto.instructions !== undefined) recipe.instructions = dto.instructions;

    if (dto.ingredients) {
      await this.ingredientRepo.createQueryBuilder().delete().where('"recipeId" = :rid', { rid: recipe.id }).execute();
      recipe.ingredients = this.ingredientRepo.create(dto.ingredients as any);
    }

    return this.recipeRepo.save(recipe);
  }

  async remove(id: string, userId: string): Promise<{ deleted: true }> {
    const recipe = await this.findOneForUser(id, userId);
    await this.recipeRepo.remove(recipe);
    return { deleted: true };
  }
}
