import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';

@Module({
  imports: [],
  exports: [],
  providers: [],
  controllers: [LinksController],
})
export class Links {}
