import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from '../db/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(createUserDto: Prisma.UserCreateInput) {
    return this.dbService.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.dbService.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.dbService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.dbService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.dbService.user.delete({
      where: {
        id,
      },
    });
  }
}
