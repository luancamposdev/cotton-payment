import { OrderEntity } from '@core/Order/entities/order.entity';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { InMemoryOrderRepository } from '@test/in-memory.order.repository';

describe('CreateOrderUseCase with InMemory Repository', () => {
  let orderRepository: InMemoryOrderRepository;
  let createOrderUseCase: CreateOrderUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    createOrderUseCase = new CreateOrderUseCase(orderRepository);
  });

  it('should create and persist an order', async () => {
    const request = {
      customerId: 'customer-123',
      creatorId: 'creator-456',
      amount: 2000,
      currency: 'BRL',
      description: 'Pedido de teste',
    };

    const { order } = await createOrderUseCase.execute(request);

    expect(order).toBeInstanceOf(OrderEntity);
    expect(order.customerId.value).toBe(request.customerId);
    expect(order.amount.value).toBe(request.amount);
    expect(order.currency.value).toBe(request.currency);
    expect(order.status.value).toBe('PENDING');
    expect(order.description).toBe(request.description);

    const storedOrder = await orderRepository.findById(order.id);
    expect(storedOrder).not.toBeNull();
    expect(storedOrder?.id).toBe(order.id);
    expect(storedOrder?.amount.value).toBe(order.amount.value);
  });

  it('should default status to PENDING if not provided', async () => {
    const request = {
      customerId: 'customer-999',
      creatorId: null,
      amount: 5000,
      currency: 'USD',
      description: null,
    };

    const { order } = await createOrderUseCase.execute(request);

    expect(order.status.value).toBe('PENDING');

    const storedOrder = await orderRepository.findById(order.id);
    expect(storedOrder?.status.value).toBe('PENDING');
  });

  it('should allow multiple orders', async () => {
    const request1 = {
      customerId: 'c1',
      creatorId: null,
      amount: 1000,
      currency: 'BRL',
      description: 'Pedido 1',
    };
    const request2 = {
      customerId: 'c2',
      creatorId: null,
      amount: 3000,
      currency: 'USD',
      description: 'Pedido 2',
    };

    const { order: order1 } = await createOrderUseCase.execute(request1);
    const { order: order2 } = await createOrderUseCase.execute(request2);

    const allOrders = await orderRepository.findAllByCustomer();
    expect(allOrders).toHaveLength(2);
    expect(allOrders.map((o) => o.id)).toEqual([order1.id, order2.id]);
  });
});
