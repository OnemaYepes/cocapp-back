import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlanService } from './meal-plan.service';
import { MealPlanController } from './meal-plan.controller';
import { AuthModule } from '../auth/auth.module';
import { Recipe } from '../recipe/entities/recipe.entity';
import { MealPlanAssignment } from './entities/meal-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlanAssignment, Recipe]), AuthModule],
  providers: [MealPlanService],
  controllers: [MealPlanController],
  exports: [MealPlanService],
})
export class MealPlanModule {}
