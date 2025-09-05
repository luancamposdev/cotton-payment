import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { CreatePaymentMethodUseCase } from '@application/payments/use-cases/create-payment-method.use-case';
import { CreatePaymentMethodDto } from '@/interfaces/payments/dto/create-payment-method.dto';
import { PaymentMethodViewModel } from '@/interfaces/payments/payment-method.view-model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(
    private readonly createPaymentMethodUseCase: CreatePaymentMethodUseCase,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async create(@Body() dto: CreatePaymentMethodDto) {
    const { paymentMethod } =
      await this.createPaymentMethodUseCase.execute(dto);

    return PaymentMethodViewModel.toHTTP(paymentMethod);
  }
}
