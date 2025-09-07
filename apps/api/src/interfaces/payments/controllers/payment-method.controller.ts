import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/common/guards/roles.guard';
import { Roles } from '@infrastructure/common/decorators/roles.decorator';
import { Role } from '@core/users/entities/user.entity';

import { CreatePaymentMethodUseCase } from '@application/payments/use-cases/create-payment-method.use-case';
import { CreatePaymentMethodDto } from '@/interfaces/payments/dto/create-payment-method.dto';
import { PaymentMethodViewModel } from '@/interfaces/payments/payment-method.view-model';
import { FindPaymentMethodByIdUseCase } from '@application/payments/use-cases/find-payment-method-by-id.use-case';
import { FindPaymentMethodsByCustomerUseCase } from '@application/payments/use-cases/find-payment-methods-by-customer.use-case';
import { UpdatePaymentMethodUseCase } from '@application/payments/use-cases/update-payment-method.use-case';

import { UpdatePaymentMethodDto } from '@/interfaces/payments/dto/update-payment-method.dto';
import { CardBrand } from '@core/payments/value-objects/card-brand.vo';
import { DeletePaymentMethodUseCase } from '@application/payments/use-cases/delete-payment-method.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(
    private readonly createPaymentMethodUseCase: CreatePaymentMethodUseCase,
    private readonly findPaymentMethodByIdUseCase: FindPaymentMethodByIdUseCase,
    private readonly findPaymentMethodsByCustomerUseCase: FindPaymentMethodsByCustomerUseCase,
    private readonly updatePaymentMethodUseCase: UpdatePaymentMethodUseCase,
    private readonly deletePaymentMethodUseCase: DeletePaymentMethodUseCase,
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

  @Get('customer/:customerId')
  @Roles(Role.CUSTOMER)
  async findByCustomerId(@Param('customerId') customerId: string) {
    const { paymentMethods } =
      await this.findPaymentMethodsByCustomerUseCase.execute(customerId);

    return paymentMethods.map((paymentMethod) =>
      PaymentMethodViewModel.toHTTP(paymentMethod),
    );
  }

  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePaymentMethodDto) {
    const { paymentMethod } = await this.updatePaymentMethodUseCase.execute(
      id,
      {
        ...dto,
        brand: dto.brand ? CardBrand.create(dto.brand) : null,
      },
    );

    return PaymentMethodViewModel.toHTTP(paymentMethod);
  }

  @Roles(Role.CUSTOMER, Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.deletePaymentMethodUseCase.execute(id);
    return { message: 'Método de pagamento removido com sucesso.' };
  }
}
