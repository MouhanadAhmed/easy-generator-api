import { Mongoose } from 'mongoose';
import { userSchema } from './schemas/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('User', userSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
