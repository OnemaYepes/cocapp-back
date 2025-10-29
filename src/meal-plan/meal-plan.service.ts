import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';
import { MealPlanAssignment } from './entities/meal-plan.entity';

@Injectable()
export class MealPlanService {
  constructor(
    @InjectRepository(MealPlanAssignment)
    private readonly mpRepo: Repository<MealPlanAssignment>,
  ) {}

  async listForUser(userId: string, startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      return this.mpRepo.find({
        where: { userId, date: Between(startDate, endDate) },
        order: { date: 'ASC' },
      });
    }
    return this.mpRepo.find({ where: { userId }, order: { date: 'ASC' } });
  }

  async getForDate(userId: string, date: string) {
    return this.mpRepo.find({ where: { userId, date }, order: { mealType: 'ASC' } });
  }

  async create(userId: string, dto: CreateMealPlanDto) {
    const entity = this.mpRepo.create({
      userId,
      date: dto.date,
      mealType: dto.mealType,
      recipe_id: dto.recipeId,
    });
    return this.mpRepo.save(entity);
  }

  async update(id: string, userId: string, dto: UpdateMealPlanDto) {
    const mp = await this.mpRepo.findOne({ where: { id, userId } });
    if (!mp) throw new NotFoundException('Assignment not found');
    if (dto.date) mp.date = dto.date;
    if (dto.mealType) mp.mealType = dto.mealType;
    if (dto.recipeId) mp.recipe_id = dto.recipeId;
    return this.mpRepo.save(mp);
  }

  async remove(id: string, userId: string) {
    const mp = await this.mpRepo.findOne({ where: { id, userId } });
    if (!mp) throw new NotFoundException('Assignment not found');
    await this.mpRepo.remove(mp);
    return { deleted: true };
  }

  // week returns assignments for the week containing 'date' (week starting Monday)
  async weekForDate(userId: string, dateStr: string) {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 Sun .. 6 Sat
    const diffToMonday = (day + 6) % 7; // days to subtract to get Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() - diffToMonday);
    // build yyyy-mm-dd strings
    const start = monday.toISOString().slice(0, 10);
    const endDate = new Date(monday);
    endDate.setDate(monday.getDate() + 6);
    const end = endDate.toISOString().slice(0, 10);
    return this.listForUser(userId, start, end);
  }
}
