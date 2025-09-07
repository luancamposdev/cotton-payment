import { BadRequestException, NotFoundException } from '@nestjs/common';

import { InMemoryOrderRepository } from '@test/in-memory.order.repository';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { UpdateOrderUseCase } from '@application/order/use-cases/update-order.use-case';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { CreateCustomerUseCase } from '@application/customer/use-cases/create-customer.use-case';

describe('UpdateOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository;
  let customerRepository: InMemoryCustomerRepository;
  let createCustomerUseCase: CreateCustomerUseCase;
  let createOrderUseCase: CreateOrderUseCase;
  let updateUseCase: UpdateOrderUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    customerRepository = new InMemoryCustomerRepository();
    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      customerRepository,
    );
    updateUseCase = new UpdateOrderUseCase(orderRepository);
  });

  it('Should update an existing order', async () => {
    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-123',
      defaultAddressId: 'addr-123',
    });

    const orderData = {
      customerId: customer.id,
      creatorId: 'creator-456',
      amount: 2000,
      currency: 'BRL',
      description: 'Pedido de teste',
    };

    const { order } = await createOrderUseCase.execute(orderData);

    const result = await updateUseCase.execute(order.id, {
      creatorId: 'creator-2',
      amount: 2500,
      currency: 'USD',
      description: 'Pedido atualizado',
      status: 'PAID',
    });

    expect(result.order.amount.value).toBe(2500);
    expect(result.order.currency.value).toBe('USD');
    expect(result.order.description).toBe('Pedido atualizado');
    expect(result.order.status.value).toBe('PAID');
    expect(result.order.creatorId).toBe('creator-2');
  });

  it('Should throw NotFoundException when order does not exist', async () => {
    await expect(
      updateUseCase.execute('invalid-id', {
        creatorId: 'creator-2',
        amount: 2500,
        currency: 'USD',
        description: 'Pedido inexistente',
        status: 'PENDING',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('Should throw BadRequestException when trying to update customerId', async () => {
    const { customer } = await createCustomerUseCase.execute({
      userId: 'user-123',
      defaultAddressId: 'addr-123',
    });

    const { order } = await createOrderUseCase.execute({
      customerId: customer.id,
      creatorId: 'creator-456',
      amount: 2000,
      currency: 'BRL',
      description: 'Pedido original',
    });

    await expect(
      updateUseCase.execute(order.id, {
        customerId: 'new-customer-id',
        creatorId: 'creator-2',
        amount: 2500,
        currency: 'USD',
        description: 'Tentativa inválida',
        status: 'PENDING',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
