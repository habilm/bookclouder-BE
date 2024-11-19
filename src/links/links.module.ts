import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from './entities/links.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Link.name,
        schema: LinkSchema,
      },
    ]),
  ],
  exports: [],
  providers: [LinksService],
  controllers: [LinksController],
})
export class Links {}
