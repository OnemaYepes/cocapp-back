import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('shopping_list_items')
@Index(['userId', 'weekStart', 'name', 'unit'], { unique: false })
export class ShoppingListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  weekStart: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: 'numeric', nullable: true })
  quantity?: number;

  @Column({ default: false })
  bought: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
