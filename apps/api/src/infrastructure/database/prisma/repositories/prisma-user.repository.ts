import { Injectable } from '@nestjs/common';

import { UserRepository } from '@core/users/repositories/user.repository';
import {
  ISocialLogin,
  Role,
  UserEntity,
} from '@core/users/entities/user.entity';
import { PrismaUserMapper } from '@/infrastructure/database/prisma/mappers/prisma-user.mapper';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(user: UserEntity): Promise<void> {
    await this.prismaService.users.create({
      data: {
        ...PrismaUserMapper.toPrisma(user),
        avatarUrl: user.avatarUrl?.value ?? null,
        role: user.role ?? Role.CUSTOMER,
        socialLogins: {
          create: (user.socialLogins || []).map((sl: ISocialLogin) => ({
            provider: sl.provider,
            providerId: sl.providerId,
          })),
        },
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.users.findUnique({
      where: {
        email: email,
      },
      include: { socialLogins: true },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      include: { socialLogins: true },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findBySocialLogin(
    provider: string,
    providerId: string,
  ): Promise<UserEntity | null> {
    const raw = await this.prismaService.socialLogin.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
      include: {
        user: {
          include: { socialLogins: true },
        },
      },
    });

    if (!raw || !raw.user) return null;

    return PrismaUserMapper.toDomain(raw.user);
  }

  async save(user: UserEntity): Promise<void> {
    const raw = PrismaUserMapper.toPrisma(user);
    await this.prismaService.users.update({
      where: { id: raw.id },
      data: {
        ...raw,
        avatarUrl: user.avatarUrl?.value ?? null,
        updatedAt: new Date(),
      },
    });

    for (const sl of user.socialLogins) {
      await this.prismaService.socialLogin.upsert({
        where: {
          provider_providerId: {
            provider: sl.provider,
            providerId: sl.providerId,
          },
        },
        create: {
          provider: sl.provider,
          providerId: sl.providerId,
          userId: user.id,
        },
        update: {},
      });
    }
  }
}
