import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { AuthGuard } from '../utility/auth.guard';
import { exceptionFactory } from '../utility/validationPipe';
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

  /**
   * create with payload and return all existing links
   */
  @Patch()
  async syncLinks(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body?: LinkCreateDTO[] | undefined,
  ) {
    //➡️ Body validation Validation
    const items = plainToInstance(LinkCreateDTO, body);
    for (const item in items) {
      const errors: ValidationError[] = await validate(items[item]);

      if (errors.length > 0) {
        const number = Number(item) + 1;
        const th = number == 1 ? 'st' : number == 2 ? 'nd' : 'th';
        throw exceptionFactory(
          errors,
          `There is an error in ${number}${th} item. ${errors[0]?.constraints && Object.values(errors[0].constraints)[0]}`,
        );
      }
    }
    ///Body validation Validation - END ⬅️

    const user = req['user'].sub;
    const created = await this.linksService.syncLinks(user, body);
    res.status(200).json(created);
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
