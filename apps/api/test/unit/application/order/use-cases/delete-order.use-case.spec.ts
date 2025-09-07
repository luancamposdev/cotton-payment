import { InMemoryOrderRepository } from '@test/in-memory.order.repository';
import { CreateOrderUseCase } from '@application/order/use-cases/create-order.use-case';
import { DeleteOrderUseCase } from '@application/order/use-cases/delete-order.use-case';
import { NotFoundException } from '@nestjs/common';

describe('DeleteOrderUseCase', () => {
  let orderRepository: InMemoryOrderRepository;
  let createOrderUseCase: CreateOrderUseCase;
  let deleteOrderUseCase: DeleteOrderUseCase;

  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    createOrderUseCase = new CreateOrderUseCase(orderRepository);
    deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);
  });

  it('Should delete an existing order', async () => {
    const { order } = await createOrderUseCase.execute({
      customerId: 'customer-123',
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
