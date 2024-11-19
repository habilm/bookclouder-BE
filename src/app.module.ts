import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

import { EmailModule } from './email/email.module';

import ConfigModule from './modulesConfig/config.module';
import jwtModule from './modulesConfig/jwt.module';
import mongooseModule from './modulesConfig/mongoose.module';
import { Links } from './links/links.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule,
    mongooseModule,
    jwtModule,
    UsersModule,
    EmailModule,
    Links,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
