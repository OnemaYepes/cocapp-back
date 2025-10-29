// src/recipe/recipe.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  Index,
} from 'typeorm';
import { MealType } from './meal-type.enum';
import { User } from 'src/user/entities/user.entity';
import { Ingredient } from './ingredient.entity';
import { MealPlan } from './meal-plan.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => (user as any).recipes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  portionSize?: string;

  @Column({ nullable: true })
  duration?: string;

  @Column({ type: 'enum', enum: MealType })
  mealType: MealType;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, { cascade: true, eager: true })
  ingredients: Ingredient[];

  @ManyToMany(() => MealPlan, (mealPlan) => mealPlan.recipes)
  mealPlans: MealPlan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
