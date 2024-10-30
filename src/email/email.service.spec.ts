import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './entities/email.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('MONGODB_URI'),
            connectionFactory: (c) => {
              c.on('connected', () => console.log('Connected'));
              c.on('error', () => console.log('error'));
              return c;
            },
          }),
        }),
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
