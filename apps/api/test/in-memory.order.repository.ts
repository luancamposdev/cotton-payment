import { OrderRepository } from '@core/Order/repository/order.repository';
import { OrderEntity } from '@core/Order/entities/order.entity';

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, OrderEntity> = new Map();

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<OrderEntity | null> {
    return this.orders.get(id) ?? null;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async findAllByCustomer(): Promise<OrderEntity[]> {
    return Array.from(this.orders.values());
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(order: OrderEntity): Promise<void> {
    this.orders.set(order.id, order);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: string): Promise<void> {
    this.orders.delete(id);
  }
}
