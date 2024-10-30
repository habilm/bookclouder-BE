import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersAuthService } from './users.auth.service';
import { UsersAuthController } from './users.auth.controller';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    EmailModule,
  ],
  controllers: [UsersController, UsersAuthController],
  providers: [UsersService, UsersAuthService],
})
export class UsersModule {}
