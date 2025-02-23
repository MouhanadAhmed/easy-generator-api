import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AsyncErrorHandlerMiddleware } from 'src/utils/middleware/catchAsyncError';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { Repository } from 'src/utils/handlers/repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders, Repository],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsyncErrorHandlerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
