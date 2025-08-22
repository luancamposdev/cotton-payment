import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CreateCreatorDto } from '@/interfaces/creators/dto/create-creator.dto';
import { CreatorsEntity } from '@core/creators/entities/creators.entity';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { FindCreatorByUserIdUseCase } from '@application/creator/use-case/find-creator-by-user-id.use-case';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('creators')
export class CreatorsController {
  constructor(
    private readonly createCreatorUseCase: CreateCreatorUseCase,
    private readonly findCreatorByUserIdUseCase: FindCreatorByUserIdUseCase,
  ) {}
  @Post()
  @Roles(Role.CREATOR)
  async create(
    @Body() dto: CreateCreatorDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CreatorsEntity> {
    dto.userId = user.id;
    const { creator } = await this.createCreatorUseCase.execute(dto);

    return creator;
  }

  @Get()
  @Roles(Role.CREATOR)
  async findByUserId(@CurrentUser() user: UserEntity): Promise<CreatorsEntity> {
    const { creator } = await this.findCreatorByUserIdUseCase.execute({
      userId: user.id,
    });

    return creator;
  }
}
