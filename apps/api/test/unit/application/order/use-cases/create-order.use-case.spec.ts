import { OrderEntity } from '@core/Order/entities/order.entity';
import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { InMemoryOrderRepository } from '@test/in-memory.order.repository';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { CreateCustomerUseCase } from '@application/customer/use-cases/create-customer.use-case';

describe('CreateOrderUseCase with InMemory Repository', () => {
  let orderRepository: InMemoryOrderRepository;
  let customerRepository: InMemoryCustomerRepository;
  let createOrderUseCase: CreateOrderUseCase;
  let createCustomerUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    customerRepository = new InMemoryCustomerRepository();
    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      customerRepository,
    );
  });

  it('should create and persist an order', async () => {
    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-123',
      defaultAddressId: 'addr-123',
    });

    const request = {
      customerId: customer.id,
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
  });

  it('should default status to PENDING if not provided', async () => {
    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-456',
      defaultAddressId: 'addr-456',
    });

    const request = {
      customerId: customer.id,
      creatorId: 'creator-999',
      amount: 5000,
      currency: 'USD',
      description: null,
    };

    const { order } = await createOrderUseCase.execute(request);

    expect(order.status.value).toBe('PENDING');

    const storedOrder = await orderRepository.findById(order.id);
    expect(storedOrder?.status.value).toBe('PENDING');
  });

  it('should allow multiple orders for different customers', async () => {
    const { customer: c1 } = await createCustomerUseCase.execute({
      userId: 'u1',
      defaultAddressId: 'a1',
    });
    const { customer: c2 } = await createCustomerUseCase.execute({
      userId: 'u2',
      defaultAddressId: 'a2',
    });

    const request1 = {
      customerId: c1.id,
      creatorId: 'creator-1',
      amount: 1000,
      currency: 'BRL',
      description: 'Pedido 1',
    };

    const request2 = {
      customerId: c2.id,
      creatorId: 'creator-2',
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
