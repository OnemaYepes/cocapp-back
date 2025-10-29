import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { MealPlan } from './entities/meal-plan.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Ingredient, MealPlan]),
    AuthModule,
  ],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
