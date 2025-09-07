import { OrderRepository } from '@core/Order/repository/order.repository';
import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { FindOrderByIDUseCase } from '@application/order/use-cases/find-order-by-id.use-case';
import { InMemoryOrderRepository } from '@test/in-memory.order.repository';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { CreateCustomerUseCase } from '@application/customer/use-cases/create-customer.use-case';

describe('FindOrderByIdUseCase', () => {
  let orderRepository: OrderRepository;
  let customerRepository: InMemoryCustomerRepository;
  let createCustomerUseCase: CreateCustomerUseCase;
  let createOrderUseCase: CreateOrderUseCase;
  let findOrderByIdUseCase: FindOrderByIDUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    customerRepository = new InMemoryCustomerRepository();
    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      customerRepository,
    );
    findOrderByIdUseCase = new FindOrderByIDUseCase(orderRepository);
  });

  it('Should return order by id', async () => {
    const dto = {
      userId: 'userId-123456',
      defaultAddressId: 'addresses-1234567',
    };

    const { customer } = await createCustomerUseCase.execute(dto);

    const request = {
      customerId: customer.id,
      creatorId: 'creator-456',
      amount: 2000,
      currency: 'BRL',
      description: 'Pedido de teste',
    };

    const { order: createdOrder } = await createOrderUseCase.execute(request);
    const { order: foundOrder } = await findOrderByIdUseCase.execute(
      createdOrder.id,
    );

    expect(foundOrder).toBeDefined();
    expect(foundOrder.id).toBe(createdOrder.id);
    expect(foundOrder.customerId.value).toBe(request.customerId);
    expect(foundOrder.amount.value).toBe(request.amount);
  });

  it('Should throw NotFoundException when order is not found', async () => {
    await expect(
      findOrderByIdUseCase.execute('non-existent-id'),
    ).rejects.toThrow('Pedido não encontrado.');
  });
});
