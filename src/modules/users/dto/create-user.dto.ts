import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password must me at least 6 character long',
  })
  password: string;

  @IsEnum(UserRole, {
    message: 'User role must be ADMIN or USER',
  })
  @IsOptional()
  role: UserRole;
}
