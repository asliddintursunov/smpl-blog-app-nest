import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { hashPassword, verifyPassword } from 'src/libs/helpers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) throw new ConflictException(`${dto.email} already exists!`);
    const hashedPswrd = await hashPassword(dto.password);
    const newUser = await this.usersService.create({
      ...dto,
      password: hashedPswrd,
    });
    return newUser;
  }

  async login(dto: LoginDto) {
    // Create JWT
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new BadRequestException('Incorrect username or password!');
    const pswrdMatch = await verifyPassword(dto.password, user.password);
    if (!pswrdMatch)
      throw new UnauthorizedException('Incorrect username or password!');
    const payload = { sub: user.id, role: user.role, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
