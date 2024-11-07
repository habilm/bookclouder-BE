import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import mongooseModule from '../modulesConfig/mongoose.module';
import jwtModule from '../modulesConfig/jwt.module';
import { UsersAuthService } from './users.auth.service';
import { UsersAuthController } from './users.auth.controller';
import { Email, EmailSchema } from '../email/entities/email.entity';
import { EmailModule } from '../email/email.module';
import configModule from '../modulesConfig/config.module';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        configModule,
        jwtModule,
        EmailModule,
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          { name: Email.name, schema: EmailSchema },
        ]),
        mongooseModule,
      ],
      controllers: [UsersController, UsersAuthController],
      providers: [UsersService, UsersAuthService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
