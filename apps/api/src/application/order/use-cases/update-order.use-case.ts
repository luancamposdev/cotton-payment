import {
  NotFoundException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { OrderRepository } from '@core/Order/repository/order.repository';
import { OrderEntity } from '@core/Order/entities/order.entity';

import { AmountVO } from '@core/Order/value-objects/amount.vo';
import { CurrencyVO } from '@core/Order/value-objects/currency.vo';
import { PaymentStatusVO } from '@core/Order/value-objects/payment-status.vo';

interface UpdateOrderRequest {
  customerId?: string | null;
  creatorId: string | null;
  amount: number;
  currency: string;
  description?: string | null;
  status: string | null;
}

@Injectable()
export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    id: string,
    request: UpdateOrderRequest,
  ): Promise<{ order: OrderEntity }> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    if (request.customerId) {
      throw new BadRequestException('ID do cliente não pode ser atualizado');
    }

    if (typeof request.creatorId !== 'undefined') {
      order['props'].creatorId = request.creatorId;
    }

    if (typeof request.amount !== 'undefined') {
      order.updateAmount(new AmountVO(request.amount));
    }

    if (request.currency) {
      order.updateCurrency(CurrencyVO.create(request.currency));
    }

    if (typeof request.description !== 'undefined') {
      order.updateDescription(request.description);
    }

    if (request.status) {
      order.updateStatus(PaymentStatusVO.create(request.status));
    }

    await this.orderRepository.save(order);

    return { order };
  }
}
