import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from './entities/links.entity';
import { Model, Types } from 'mongoose';
import { LinkCreateDTO } from './dtos/Links.dto';

@Injectable()
export class LinksService {
  constructor(@InjectModel(Link.name) private LintModel: Model<Link>) {}
  async getLinks(userId?: string): Promise<Link[] | []> {
    return (
      (await this.LintModel.find({
        deletedAt: null,
        userId: new Types.ObjectId(userId),
      })) || []
    );
  }

  async getLinkById(userId: string, id: string): Promise<Link> {
    const link = await this.LintModel.findOne({
      deletedAt: null,
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    if (!link) throw new NotFoundException('Link not found');
    return link;
  }

  async createLink(
    userId: string | Types.ObjectId,
    createData: LinkCreateDTO,
  ): Promise<Link & { _id: unknown; exist?: boolean }> {
    userId = new Types.ObjectId(userId);
    const duplicateLink = await this.LintModel.findOne({
      userId: new Types.ObjectId(userId),
      url: createData.url,
      deletedAt: null,
    });

    if (duplicateLink) {
      const link = duplicateLink.toJSON();

      return { exist: true, ...link };
    }
    return await this.LintModel.create({ userId, ...createData });
  }

  async updateLink(
    userId: string | Types.ObjectId,
    linkId: string,
    createData: LinkCreateDTO,
  ) {
    userId = new Types.ObjectId(userId);
    const link = await this.LintModel.findOne({
      userId: userId,
      _id: new Types.ObjectId(linkId),
    });

    if (!link) throw new NotFoundException('No link found');

    const duplicateLink = await this.LintModel.findOne({
      userId: userId,
      url: createData.url,
      _id: { $ne: new Types.ObjectId(linkId) },
    });

    if (duplicateLink) {
      throw new UnprocessableEntityException('Duplicate link');
    }

    for (const key in createData) {
      link.set(key, createData[key]);
    }

    return await link.save();
  }
  async deleteLink(
    userId: string | Types.ObjectId,
    linkId: string,
  ): Promise<Link> {
    if (!Types.ObjectId.isValid(linkId))
      throw new NotFoundException('Item Not Found');
    userId = new Types.ObjectId(userId);
    const link = await this.LintModel.findOne({
      userId: userId,
      _id: new Types.ObjectId(linkId),
    });

    if (!link) throw new NotFoundException('No link found');

    link.set('deletedAt', new Date());

    return await link.save();
  }
}
