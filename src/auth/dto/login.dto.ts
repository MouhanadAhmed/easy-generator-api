import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(5)
  readonly password: string;
}
