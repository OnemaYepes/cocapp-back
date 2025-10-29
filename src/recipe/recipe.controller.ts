import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { JwtGuard } from '../security/jwt.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@UseGuards(JwtGuard)
@Controller('v1/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateRecipeDto) {
    return this.recipeService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.recipeService.findByUser(userId);
  }

  @Get('search')
  async search(@Req() req: AuthenticatedRequest, @Query('q') q: string) {
    const userId = req.user.id;
    return this.recipeService.search(userId, q || '');
  }

  @Get(':id')
  async findOne(@Req() req: AuthenticatedRequest, @Param('id', new ParseUUIDPipe()) id: string) {
    const userId = req.user.id;
    return this.recipeService.findOneForUser(id, userId);
  }

  @Put(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    const userId = req.user.id;
    return this.recipeService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: AuthenticatedRequest, @Param('id', new ParseUUIDPipe()) id: string) {
    const userId = req.user.id;
    await this.recipeService.remove(id, userId);
  }
}
