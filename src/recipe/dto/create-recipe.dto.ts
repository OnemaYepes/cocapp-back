// src/recipe/dto/create-recipe.dto.ts
import { IsString, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MealType } from '../entities/meal-type.enum';

class IngredientDto {
  @IsString()
  name: string;

  @IsString()
  quantity?: string;

  @IsString()
  unit?: string;

  @IsEnum(['orgánico', 'procesado', 'natural'])
  type: string;


}

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsEnum(MealType)
  mealType: MealType;

  @IsString()
  preparation?: string;

  @IsString()
  portionSize?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsString()
  instructions?: string;
}
