import { OrderEntity } from '@core/Order/entities/order.entity';

export interface OrderView {
  id: string;
  customerId: string;
  creatorId: string | null;
  amount: number; // valor em centavos
  currency: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderViewModel {
  static toHTTP(order: OrderEntity): OrderView {
    return {
      id: order.id,
      customerId: order.customerId.value,
      creatorId: order.creatorId ?? null,
      amount: order.amount.value,
      currency: order.currency.value,
      description: order.description ?? null,
      status: order.status.value,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toHTTPList(orders: OrderEntity[]): OrderView[] {
    return orders.map((order) => this.toHTTP(order));
  }
}
