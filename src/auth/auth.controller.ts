import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/tokenDto';
import { SkipAuth } from 'src/authorization/skip.auth.decorator';
import { SignupUserDto } from './dto/signup.user.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('logout')
  @SkipAuth()
  logout(@Body() tokenDto: TokenDto) {
    return this.authService.logOut(tokenDto);
  }

  @Post('signup')
  @SkipAuth()
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUp(signupUserDto);
  }
}
