import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './entities/email.entity';

import mongooseModule from '../modulesConfig/mongoose.module';
import configModule from '../modulesConfig/config.module';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        configModule,
        mongooseModule,
        MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
      ],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
