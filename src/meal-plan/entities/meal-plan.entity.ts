import { Recipe } from 'src/recipe/entities/recipe.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity('meal_plan_assignments')
export class MealPlanAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  mealType: string;

  @ManyToOne(() => Recipe, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe | null;

  @Column({ nullable: true })
  recipe_id?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
