import { Injectable, NotFoundException } from '@nestjs/common';

import { OrderRepository } from '@core/Order/repository/order.repository';

@Injectable()
export class DeleteOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async excute(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new NotFoundException('Pedido não encontrado.');

    await this.orderRepository.delete(id);
  }
}
