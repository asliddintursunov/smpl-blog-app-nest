import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsString()
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
  role: UserRole;
}
