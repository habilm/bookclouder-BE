import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';

import { Tag } from './entities/tag.entity';
@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagsModel: Model<Tag>) {}
  create() {
    return 'This action adds a new tag';
  }

  async findAll(userId: string) {
    return await this.tagsModel.find({
      userId: new Types.ObjectId(userId),
      deletedAt: null,
    });
  }

  /**
   * Find By name and create a new tag if not found
   * @param name the name of the tag
   * @returns The Tag object
   */

  async findOrCreate(
    userId: string | Types.ObjectId,
    tag: Partial<Tag> & { name: string },
    session?: ClientSession,
  ): Promise<Tag & { _id: unknown; exist?: boolean }> {
    const exist = await this.tagsModel.findOne<Tag & { exist?: boolean }>({
      name: tag.name.toLowerCase(),
      userId: new Types.ObjectId(userId),
      deletedAt: null,
    });
    if (exist) {
      exist.exist = true;
      return exist;
    }
    const newTag = await this.tagsModel.create(
      [
        {
          userId: new Types.ObjectId(userId),
          name: tag.name.toLowerCase(),
          color: tag.color || null,
        },
      ],
      { session },
    );
    return newTag[0];
  }

  update() {}

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
