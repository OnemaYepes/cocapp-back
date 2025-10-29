import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['orgánico', 'procesado', 'natural'],
    default: 'natural'
  })
  type: string;

  @Column({ nullable: true })
  quantity?: string;

  @Column({ nullable: true })
  unit?: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  recipe: Recipe;
}