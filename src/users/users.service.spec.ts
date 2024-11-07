import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import configModule from '../modulesConfig/config.module';
import jwtModule from '../modulesConfig/jwt.module';
import mongooseModule from '../modulesConfig/mongoose.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { EmailModule } from '../email/email.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        configModule,
        mongooseModule,
        EmailModule,
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
        jwtModule,
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
