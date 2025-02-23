import { Optional } from '@nestjs/common';
import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format.' })
  @MaxLength(50, { message: 'Email must not exceed 50 characters.' })
  readonly email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter, one number, and one special character.',
  })
  readonly password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly role: string;

}
