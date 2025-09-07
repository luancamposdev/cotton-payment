import { InMemoryOrderRepository } from '@test/in-memory.order.repository';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { FindOrderByCustomerIdUseCase } from '@application/order/use-cases/find-order-by-customer-id.use-case';

import { OrderRepository } from '@core/Order/repository/order.repository';
import { CreateCustomerUseCase } from '@application/customer/use-cases/create-customer.use-case';

describe('FindOrderByCustomerIdUseCase', () => {
  let orderRepository: OrderRepository;
  let customerRepository: InMemoryCustomerRepository;
  let createCustomerUseCase: CreateCustomerUseCase;
  let createOrderUseCase: CreateOrderUseCase;
  let findOrderByCustomerIdUseCase: FindOrderByCustomerIdUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    customerRepository = new InMemoryCustomerRepository();
    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      customerRepository,
    );
    findOrderByCustomerIdUseCase = new FindOrderByCustomerIdUseCase(
      orderRepository,
    );
  });

  it('Should return orders by customer id', async () => {
    const dto = {
      userId: 'userId-123456',
      defaultAddressId: 'addresses-1234567',
    };

    const { customer } = await createCustomerUseCase.execute(dto);

    const orderData = {
      customerId: customer.id,
      creatorId: 'creator-456',
      amount: 2000,
      currency: 'BRL',
      description: 'Pedido de teste',
    };

    await createOrderUseCase.execute(orderData);
    await createOrderUseCase.execute(orderData);

    const { orders } = await findOrderByCustomerIdUseCase.execute(
      orderData.customerId,
    );

    expect(orders).toHaveLength(2);
    orders.forEach((order) => {
      expect(order.customerId.value).toBe(orderData.customerId);
      expect(order.amount.value).toBe(orderData.amount);
      expect(order.currency.value.toString()).toBe(orderData.currency);
      expect(order.description).toBe(orderData.description);
    });
  });

  it('Should return empty array when customer has no orders', async () => {
    const { orders } = await findOrderByCustomerIdUseCase.execute(
      'non-existent-customer',
    );

    expect(orders).toHaveLength(0);
    expect(orders).toEqual([]);
  });
});
