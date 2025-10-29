import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Recipe } from '../recipe/entities/recipe.entity';
import { Ingredient } from '../recipe/entities/ingredient.entity';
import { ShoppingListItem } from './entities/shopping.entity';
import { MealPlanAssignment } from 'src/meal-plan/entities/meal-plan.entity';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(ShoppingListItem)
    private readonly itemRepo: Repository<ShoppingListItem>,

    @InjectRepository(MealPlanAssignment)
    private readonly mpRepo: Repository<MealPlanAssignment>,

    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,

    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  private getWeekStart(dateStr: string) {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diffToMonday = (day + 6) % 7;
    const monday = new Date(date);
    monday.setDate(date.getDate() - diffToMonday);
    return monday.toISOString().slice(0, 10);
  }

  async generateWeekList(userId: string, dateStr: string) {
    const weekStart = this.getWeekStart(dateStr);
    const end = new Date(weekStart);
    end.setDate(new Date(weekStart).getDate() + 6);
    const endStr = end.toISOString().slice(0, 10);

    const assignments = await this.mpRepo.find({
      where: { userId, date: Between(weekStart, endStr) },
      relations: ['recipe'],
    });

    type Key = string;
    const map = new Map<Key, { name: string; unit?: string; quantity: number }>();
    for (const a of assignments) {
      if (!a.recipe) continue;
      const recipe = await this.recipeRepo.findOne({ where: { id: a.recipe.id }, relations: ['ingredients'] });
      if (!recipe) continue;
      for (const ing of recipe.ingredients || []) {
        const key = `${ing.name}||${ing.unit || ''}`;
        const q = Number(ing.quantity || 0);
        const ex = map.get(key);
        if (ex) ex.quantity += q;
        else map.set(key, { name: ing.name, unit: ing.unit, quantity: q });
      }
    }

    const items: ShoppingListItem[] = [];
    for (const [key, val] of map) {
      let existing = await this.itemRepo.findOne({ where: { userId, weekStart, name: val.name, unit: val.unit } });
      if (existing) {
        existing.quantity = (Number(existing.quantity || 0) + val.quantity) as any;
        await this.itemRepo.save(existing);
        items.push(existing);
      } else {
        const it = this.itemRepo.create({
          userId,
          weekStart,
          name: val.name,
          unit: val.unit,
          quantity: val.quantity,
          bought: false,
        });
        items.push(await this.itemRepo.save(it));
      }
    }

    return items;
  }

  async markItem(id: string, userId: string, bought: boolean) {
    const it = await this.itemRepo.findOne({ where: { id, userId } });
    if (!it) throw new Error('Item not found');
    it.bought = bought;
    await this.itemRepo.save(it);
    return it;
  }

  async exportWeek(userId: string, dateStr: string) {
    const weekStart = this.getWeekStart(dateStr);
    const items = await this.itemRepo.find({ where: { userId, weekStart }, order: { name: 'ASC' } });
    const lines = items.map((i) => `${i.name} ${i.quantity ?? ''} ${i.unit ?? ''} ${i.bought ? '[✔]' : ''}`.trim());
    return lines.join('\n');
  }
}
