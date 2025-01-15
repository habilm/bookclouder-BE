import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

import { EmailModule } from './email/email.module';

import ConfigModule from './modulesConfig/config.module';
import jwtModule from './modulesConfig/jwt.module';
import mongooseModule from './modulesConfig/mongoose.module';
import { Links } from './links/links.module';
import { TagsModule } from './tags/tags.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    mongooseModule,
    ThrottlerModule.forRoot([
      {
        name: 'main',
        ttl: 60000,
        limit: 60,
      },
    ]),

    jwtModule,
    UsersModule,
    EmailModule,
    Links,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
