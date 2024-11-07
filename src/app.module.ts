import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { EmailModule } from './email/email.module';

import ConfigModule from './modulesConfig/config.module';
import jwtModule from './modulesConfig/jwt.module';
import mongooseModule from './modulesConfig/mongoose.module';

@Module({
  imports: [ConfigModule, mongooseModule, jwtModule, UsersModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
