import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export default MongooseModule.forRootAsync({
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
});
