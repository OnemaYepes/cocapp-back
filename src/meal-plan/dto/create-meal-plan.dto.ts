import { IsString, IsUUID, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { MealType } from 'src/recipe/entities/meal-type.enum';


export class CreateMealPlanDto {
  @IsDateString()
  date: string;

  @IsEnum(MealType)
  mealType: MealType;

  @IsUUID()
  recipeId: string;
}
