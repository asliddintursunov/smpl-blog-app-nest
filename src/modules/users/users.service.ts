import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DatabaseService } from 'src/modules/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        role: true,
        password: true,
        id: true,
      },
    });
  }

  create(data: CreateUserDto) {
    return this.db.user.create({
      data: {
        ...data,
        name: data.name ?? data.email.split('@')[0],
      },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });
  }

  delete(userId: string, currUserId: string) {
    if (userId === currUserId)
      throw new BadRequestException('You cannot delete yourself!');
    return this.db.user.delete({ where: { id: userId } });
  }
}
