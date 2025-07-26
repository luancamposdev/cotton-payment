import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as uuid from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.users.create({
      data: { id: uuid.randomUUID(), ...createUserDto },
    });
  }

  findAll() {
    return this.prismaService.users.findMany();
  }
}
