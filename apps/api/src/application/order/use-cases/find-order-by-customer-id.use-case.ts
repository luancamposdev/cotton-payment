import { Injectable } from '@nestjs/common';

import { OrderRepository } from '@core/Order/repository/order.repository';
import { OrderEntity } from '@core/Order/entities/order.entity';

@Injectable()
export class FindOrderByCustomerIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(customerId: string): Promise<{ orders: OrderEntity[] }> {
    const orders =
      (await this.orderRepository.findAllByCustomer(customerId)) ?? [];

    return { orders };
  }
}
