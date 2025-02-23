import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    ConfigService,
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService
    ): Promise<typeof mongoose> => {
      console.log(`connect to DB ${configService.get('DB_CONNECTION_CLOUD')}`); // Using ConfigService to fetch environment variable
      return await mongoose.connect(configService.get('DB_CONNECTION_CLOUD'));
    },
  },
];
