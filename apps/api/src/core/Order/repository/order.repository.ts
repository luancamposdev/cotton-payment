import { OrderEntity } from '@core/Order/entities/order.entity';

export abstract class OrderRepository {
  abstract findById(id: string): Promise<OrderEntity | null>;
  abstract findAll(): Promise<OrderEntity[]>;
  abstract save(order: OrderEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
