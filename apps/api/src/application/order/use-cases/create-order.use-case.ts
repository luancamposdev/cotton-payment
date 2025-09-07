import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderRepository } from '@core/Order/repository/order.repository';
import { OrderEntity } from '@core/Order/entities/order.entity';

import { CustomerId } from '@core/payments/value-objects/customer-id.vo';
import { AmountVO } from '@core/Order/value-objects/amount.vo';
import { CurrencyVO } from '@core/Order/value-objects/currency.vo';
import { PaymentStatusVO } from '@core/Order/value-objects/payment-status.vo';
import { CustomerRepository } from '@core/customer/repository/customer.repository';

interface CreateOrderRequest {
  customerId: string;
  creatorId: string;
  amount: number; // valor em centavos
  currency: string; // 'BRL', 'USD', etc
  description: string | null;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(request: CreateOrderRequest): Promise<{ order: OrderEntity }> {
    const customerIdVO = new CustomerId(request.customerId);
    const amountVO = new AmountVO(request.amount);
    const currencyVO = CurrencyVO.create(request.currency);
    const statusVO = new PaymentStatusVO('PENDING');

    const customerExists = await this.customerRepository.findById(
      request.customerId,
    );
    if (!customerExists) {
      throw new NotFoundException(
        `Cliente ${request.customerId} não encontrado`,
      );
    }

    const order = new OrderEntity({
      customerId: customerIdVO,
      creatorId: request.creatorId,
      amount: amountVO,
      currency: currencyVO,
      description: request.description,
      status: statusVO,
    });

    await this.orderRepository.save(order);

    return { order };
  }
}
