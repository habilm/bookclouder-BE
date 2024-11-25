import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

import { Request, Response } from 'express';
import { AuthGuard } from '../utility/auth.guard';

@Controller('tags')
@UseGuards(AuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createTagDto: CreateTagDto,
    @Res() res: Response,
  ) {
    const userId = req['user'].sub;
    const tag = await this.tagsService.findOrCreate(userId, createTagDto);

    res.status(tag.exist ? 200 : 201).json(tag);
    return;
  }

  @Get()
  async findAll(@Req() req: Request) {
    const userId = req['user'].sub;
    return await this.tagsService.findAll(userId);
  }

  @Get(':id')
  findOne() {
    // return this.tagsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].sub;
    return this.tagsService.remove(userId, id);
  }
}
