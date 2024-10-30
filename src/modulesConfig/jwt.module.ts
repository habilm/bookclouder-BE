import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export default JwtModule.registerAsync({
  global: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async function (configService: ConfigService) {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '24h' },
      global: true,
    };
  },
});
