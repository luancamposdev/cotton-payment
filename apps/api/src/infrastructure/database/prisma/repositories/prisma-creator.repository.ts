import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatorRepository } from '@core/creators/repositories/creator.repository';
import { CreatorsEntity } from '@core/creators/entities/creators.entity';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { PrismaCreatorMapper } from '@infrastructure/database/prisma/mappers/prisma-creator.mapper';

@Injectable()
export class PrismaCreatorRepository implements CreatorRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(creator: CreatorsEntity): Promise<void> {
    const userExists = await this.prismaService.users.findUnique({
      where: { id: creator.userId },
    });

    if (!userExists) {
      throw new NotFoundException(
        `Usuário com id ${creator.userId} não encontrado`,
      );
    }

    await this.prismaService.creator.create({
      data: PrismaCreatorMapper.toPrisma(creator),
      include: { socialLinks: true },
    });
  }

  async findByUserId(userId: string): Promise<CreatorsEntity | null> {
    const raw = await this.prismaService.creator.findUnique({
      where: { userId },
      include: { socialLinks: true, user: true },
    });

    if (!raw) return null;
    return PrismaCreatorMapper.toDomain({
      ...raw,
      userId: raw.user.id,
    });
  }

  async save(creator: CreatorsEntity): Promise<void> {
    await this.prismaService.creator.update({
      where: { id: creator.id },
      data: {
        bio: creator.bio,
        socialLinks: {
          deleteMany: {},
          create: creator.socialLinks.map((link) => ({
            provider: link.provider,
            url: link.value,
          })),
        },
      },
    });
  }
}
