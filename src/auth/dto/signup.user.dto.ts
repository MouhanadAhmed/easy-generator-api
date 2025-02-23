import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class SignupUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  recaptchaToken: string;
}
