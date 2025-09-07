import { NotFoundException } from '@nestjs/common';

import { OrderRepository } from '@core/Order/repository/order.repository';
import { OrderEntity } from '@core/Order/entities/order.entity';

export class FindOrderByIDUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<{ order: OrderEntity }> {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new NotFoundException('Pedido não encontrado.');

    return { order };
  }
}
