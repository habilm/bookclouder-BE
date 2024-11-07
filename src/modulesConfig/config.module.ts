import { ConfigModule } from '@nestjs/config';

export default ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
});
