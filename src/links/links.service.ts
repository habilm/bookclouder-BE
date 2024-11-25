import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Link } from './entities/links.entity';
import { Connection, Model, Types } from 'mongoose';
import { LinkCreateDTO } from './dtos/Links.dto';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(Link.name) private LintModel: Model<Link>,
    @InjectConnection() private DbConnection: Connection,
    private tagsService: TagsService,
  ) {}
  async getLinks(userId?: string): Promise<Link[] | []> {
    return (
      (await this.LintModel.find({
        deletedAt: null,
        userId: new Types.ObjectId(userId),
      }).populate('tags')) || []
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

  /**
   * Create or update link if it already exists.tags will merged with existing.
   * @param userId user Object Id
   * @param createData { LinkCreateDTO }
   * @returns Link
   */
  async createLink(
    userId: string | Types.ObjectId,
    createData: LinkCreateDTO,
  ): Promise<(Link & { _id: unknown; exist?: boolean }) | { exist?: boolean }> {
    userId = new Types.ObjectId(userId);
    const duplicateLink = await this.LintModel.findOne({
      userId: new Types.ObjectId(userId),
      url: createData.url,
      deletedAt: null,
    });

    const session = await this.DbConnection.startSession();
    session.startTransaction();

    const existingTags = duplicateLink?.tags.map((tag) => tag.toString()) || [];

    try {
      const tagIds = [];
      if (createData.tags?.length > 0) {
        for (let i = 0; i < createData.tags.length; i++) {
          const createdTag = await this.tagsService.findOrCreate(
            userId,
            { name: createData.tags[i] },
            session,
          );
          if (!existingTags.includes(createdTag._id.toString())) {
            tagIds.push(createdTag._id);
          }
        }
      }

      createData.tags = [...(duplicateLink?.tags || []), ...tagIds];
      let link;
      if (duplicateLink) {
        for (const k in createData) {
          duplicateLink[k] = createData[k];
        }

        duplicateLink.save();
        await duplicateLink.populate('tags');
        link = duplicateLink.toJSON();
        link = { exist: true, ...link };
      } else {
        const created = await this.LintModel.create(
          [{ userId, ...createData }],
          {
            session,
          },
        );
        link = created.length > 0 ? await created[0].populate('tags') : {};
      }
      session.commitTransaction();
      return link;
    } catch (e) {
      console.log(e);
      session.abortTransaction();
      throw new InternalServerErrorException(e);
    }
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

    if (createData.tags?.length > 0) {
      const tagIds = [];
      for (let i = 0; i < createData.tags.length; i++) {
        const createdTag = await this.tagsService.findOrCreate(userId, {
          name: createData.tags[i],
        });
        tagIds.push(createdTag._id);
      }
      createData.tags = tagIds;
    }

    for (const key in createData) {
      await link.set(key, createData[key]);
    }
    link.populate('tags', '_id name color');
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
