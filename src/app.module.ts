import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AllExceptionsFilter } from './utils/filter/all.exceptions.filter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './authorization/auth.guard';
import { UserService } from './user/user.service';
import { userProviders } from './user/user.providers';
import { DatabaseModule } from './database/database.module';
import { Repository } from './utils/handlers/repository';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from './authorization/roles.guard';
import { TokenService } from './authorization/token.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the module globally available
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    Repository,
    JwtService,
    UserService,
    TokenService,
    ...userProviders,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
