import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { CreateCreatorDto } from '@/interfaces/creators/dto/create-creator.dto';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { FindCreatorByUserIdUseCase } from '@application/creator/use-case/find-creator-by-user-id.use-case';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { UpdateCreatorDto } from '@/interfaces/creators/dto/update.creator.dto';
import { UpdateCreatorUseCase } from '@application/creator/use-case/update-creator.use-case';
import {
  CreatorView,
  CreatorViewModel,
} from '@/interfaces/creators/creator.view.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('creators')
export class CreatorsController {
  constructor(
    private readonly createCreatorUseCase: CreateCreatorUseCase,
    private readonly updateCreatorUseCase: UpdateCreatorUseCase,
    private readonly findCreatorByUserIdUseCase: FindCreatorByUserIdUseCase,
  ) {}
  @Post()
  @Roles(Role.CREATOR)
  async create(
    @Body() dto: CreateCreatorDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CreatorView> {
    dto.userId = user.id;
    const { creator } = await this.createCreatorUseCase.execute(dto);

    return CreatorViewModel.toHTTP(creator);
  }

  @Patch()
  @Roles(Role.CREATOR)
  async update(
    @Body() dto: UpdateCreatorDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CreatorView> {
    const { creator } = await this.updateCreatorUseCase.execute({
      userId: user.id,
      dto,
    });

    return CreatorViewModel.toHTTP(creator);
  }

  @Get()
  @Roles(Role.CREATOR)
  async findByUserId(@CurrentUser() user: UserEntity): Promise<CreatorView> {
    const { creator } = await this.findCreatorByUserIdUseCase.execute({
      userId: user.id,
    });

    return CreatorViewModel.toHTTP(creator);
  }
}
