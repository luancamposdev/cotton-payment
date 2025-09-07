import { BadRequestException, NotFoundException } from '@nestjs/common';

import { InMemoryOrderRepository } from '@test/in-memory.order.repository';

import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { UpdateOrderUseCase } from '@application/order/use-cases/update-order.use-case';

describe('UpdateOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository;
  let createOrderUseCase: CreateOrderUseCase;
  let updateUseCase: UpdateOrderUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    createOrderUseCase = new CreateOrderUseCase(orderRepository);
    updateUseCase = new UpdateOrderUseCase(orderRepository);
  });

  it('Should update an existing order', async () => {
    const orderData = {
      customerId: 'customer-123',
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
    const { order } = await createOrderUseCase.execute({
      customerId: 'customer-123',
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
