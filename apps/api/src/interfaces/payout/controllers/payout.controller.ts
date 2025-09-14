import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { CreatePayoutUseCase } from '@application/payout/use-cases/create-payout.use-case';

import { CreatePayoutDto } from '@/interfaces/payout/dto/create-payout.dto';
import { PayoutViewModel } from '@/interfaces/payout/payout.view-model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payout')
export class PayoutController {
  constructor(private readonly createPayoutUseCase: CreatePayoutUseCase) {}

  @Post()
  @Roles(Role.CREATOR, Role.ADMIN)
  async create(@Body() dto: CreatePayoutDto) {
    const { payout } = await this.createPayoutUseCase.execute(dto);

    return PayoutViewModel.toHTTP(payout);
  }
}
