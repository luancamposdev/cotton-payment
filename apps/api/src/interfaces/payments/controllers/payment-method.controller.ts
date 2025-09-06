import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { CreatePaymentMethodUseCase } from '@application/payments/use-cases/create-payment-method.use-case';
import { CreatePaymentMethodDto } from '@/interfaces/payments/dto/create-payment-method.dto';
import { PaymentMethodViewModel } from '@/interfaces/payments/payment-method.view-model';
import { FindPaymentMethodByIdUseCase } from '@application/payments/use-cases/find-payment-method-by-id.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(
    private readonly createPaymentMethodUseCase: CreatePaymentMethodUseCase,
    private readonly findPaymentMethodByIdUseCase: FindPaymentMethodByIdUseCase,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER)
  async create(@Body() dto: CreatePaymentMethodDto) {
    const { paymentMethod } =
      await this.createPaymentMethodUseCase.execute(dto);

    return PaymentMethodViewModel.toHTTP(paymentMethod);
  }

  @Get(':id')
  @Roles(Role.CUSTOMER)
  async findById(@Param('id') id: string) {
    const { paymentMethod } =
      await this.findPaymentMethodByIdUseCase.execute(id);

    return PaymentMethodViewModel.toHTTP(paymentMethod);
  }
}
