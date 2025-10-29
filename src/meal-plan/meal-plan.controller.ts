import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtGuard } from '../security/jwt.guard';
import { MealPlanService } from './meal-plan.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { UpdateMealPlanDto } from './dto/update-meal-plan.dto';

@UseGuards(JwtGuard)
@Controller('v1/meal-plans')
export class MealPlanController {
  constructor(private readonly mpService: MealPlanService) {}

  @Get()
  async list(@Req() req: any, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const userId = req.user.id;
    return this.mpService.listForUser(userId, startDate, endDate);
  }

  @Get(':date')
  async getByDate(@Req() req: any, @Param('date') date: string) {
    const userId = req.user.id;
    return this.mpService.getForDate(userId, date);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateMealPlanDto) {
    const userId = req.user.id;
    return this.mpService.create(userId, dto);
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateMealPlanDto) {
    const userId = req.user.id;
    return this.mpService.update(id, userId, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id', new ParseUUIDPipe()) id: string) {
    const userId = req.user.id;
    return this.mpService.remove(id, userId);
  }

  @Get('week/:date')
  async week(@Req() req: any, @Param('date') date: string) {
    const userId = req.user.id;
    return this.mpService.weekForDate(userId, date);
  }
}
