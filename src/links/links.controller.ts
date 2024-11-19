import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../utility/auth.guard';
import { LinkCreateDTO } from './dtos/Links.dto';
import { LinksService } from './links.service';

@Controller('links')
@UseGuards(AuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}
  @Get()
  async getLinks(@Req() req: Request) {
    const user = req['user'].sub;
    return await this.linksService.getLinks(user);
  }

  @Get(':id')
  async getLinkById(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'].sub;
    return await this.linksService.getLinkById(user, id);
  }

  @Post()
  async createLink(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LinkCreateDTO,
  ) {
    const user = req['user'].sub;
    const created = await this.linksService.createLink(user, body);
    res.status(created.exist ? 200 : 201).json(created);
  }

  @Put(':id')
  async updateLink(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: LinkCreateDTO,
  ) {
    const user = req['user'].sub;
    return await this.linksService.updateLink(user, id, body);
  }

  @Delete(':id')
  async deleteLink(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'].sub;
    return await this.linksService.deleteLink(user, id);
  }
}
