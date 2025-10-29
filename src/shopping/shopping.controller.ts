import { Controller, UseGuards, Get, Post, Body, Req, Param, Query } from '@nestjs/common';
import { JwtGuard } from '../security/jwt.guard';
import { ShoppingService } from './shopping.service';
import { CheckItemDto } from './dto/check-item.dto';

@UseGuards(JwtGuard)
@Controller('v1/shopping-lists')
export class ShoppingController {
  constructor(private readonly shopping: ShoppingService) {}

  @Get('week/:date')
  async week(@Req() req: any, @Param('date') date: string) {
    return this.shopping.generateWeekList(req.user.id, date);
  }

  @Post('check')
  async check(@Req() req: any, @Body() dto: CheckItemDto) {
    return this.shopping.markItem(dto.id, req.user.id, dto.bought);
  }

  @Get('export')
  async exportWeek(@Req() req: any, @Query('date') date: string) {
    return (await this.shopping.exportWeek(req.user.id, date || new Date().toISOString().slice(0, 10)));
  }
}
