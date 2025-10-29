import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { Recipe } from '../recipe/entities/recipe.entity';
import { Ingredient } from '../recipe/entities/ingredient.entity';
import { AuthModule } from '../auth/auth.module';
import { ShoppingListItem } from './entities/shopping.entity';
import { MealPlanAssignment } from 'src/meal-plan/entities/meal-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingListItem, MealPlanAssignment, Recipe, Ingredient]), AuthModule],
  providers: [ShoppingService],
  controllers: [ShoppingController],
})
export class ShoppingModule {}
