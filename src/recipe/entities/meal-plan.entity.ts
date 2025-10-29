import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('meal_plans')
export class MealPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.mealPlans, { cascade: false })
  @JoinTable({
    name: 'meal_plan_recipes',
    joinColumn: { name: 'meal_plan_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recipe_id', referencedColumnName: 'id' },
  })
  recipes: Recipe[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
