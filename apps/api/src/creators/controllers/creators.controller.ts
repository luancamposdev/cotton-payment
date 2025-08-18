import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CreateCreatorDto } from '@/creators/dto/create-creator.dto';
import { CreatorsEntity } from '@core/creators/creators.entity';
import { CreateCreatorsService } from '@/creators/services/creators.service';
import { JwtAuthGuard } from '@/auth/passport/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Role, UserEntity } from '@core/users/entities/user.entity';
import { Roles } from '@/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreateCreatorsService) {}
  @Post()
  @Roles(Role.CREATOR)
  async create(
    @Body() dto: CreateCreatorDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CreatorsEntity> {
    dto.userId = user.id;
    return await this.creatorsService.create(dto);
  }

  @Get()
  @Roles(Role.CREATOR)
  async findByUserId(@CurrentUser() user: UserEntity): Promise<CreatorsEntity> {
    return this.creatorsService.findCreatorByUserId(user.id);
  }
}
