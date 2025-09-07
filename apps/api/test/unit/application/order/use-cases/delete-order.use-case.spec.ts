import { InMemoryOrderRepository } from '@test/in-memory.order.repository';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { DeleteOrderUseCase } from '@application/order/use-cases/delete-order.use-case';
import { NotFoundException } from '@nestjs/common';
import { CreateCustomerUseCase } from '@application/customer/use-cases/create-customer.use-case';

describe('DeleteOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository;
  let customerRepository: InMemoryCustomerRepository;
  let createCustomerUseCase: CreateCustomerUseCase;
  let createOrderUseCase: CreateOrderUseCase;
  let deleteOrderUseCase: DeleteOrderUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    customerRepository = new InMemoryCustomerRepository();

    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      customerRepository,
    );
    deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);
  });

  it('Should delete an existing order', async () => {
    const dto = {
      userId: 'userId-123456',
      defaultAddressId: 'addresses-1234567',
    };

    const { customer } = await createCustomerUseCase.execute(dto);

    const { order } = await createOrderUseCase.execute({
      customerId: customer.id,
      creatorId: 'creator-456',
      amount: 2000,
      currency: 'BRL',
      description: 'Pedido de teste',
    });

    await deleteOrderUseCase.excute(order.id);

    const found = await orderRepository.findById(order.id);
    expect(found).toBeNull();
  });

  it('Should throw NotFoundException when order does not exist', async () => {
    await expect(deleteOrderUseCase.excute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
