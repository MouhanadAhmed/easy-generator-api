import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { DatabaseModule } from 'src/database/database.module';
import { Repository } from 'src/utils/handlers/repository';
import { userProviders } from 'src/user/user.providers';
import { JwtModule } from '@nestjs/jwt';
import { RecaptchaService } from './recaptcha.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    UserService,
    RecaptchaService,
    AuthService,
    ...userProviders,
    Repository,
  ],
})
export class AuthModule {}
