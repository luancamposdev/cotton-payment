import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { UpdateCustomerUseCase } from '@application/customer/use-case/update-customer.use-case';
import { UpdateCustomerDto } from '@/interfaces/customer/dto/update.customer.dto';

describe('Customer Update Use Case', () => {
  const customerRepository = new InMemoryCustomerRepository();
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

  it('should update customers details', async () => {
    const dto = {
      userId: 'user-joao',
      defaultAddressId: 'my-addresses-id',
    };

    await createCustomerUseCase.execute(dto);

    const updateDTO: UpdateCustomerDto = {
      defaultAddressId: 'my-addresses-id',
    };

    const { customer } = await updateCustomerUseCase.execute({
      userId: 'user-joao',
      dto: updateDTO,
    });

    expect(customer).toBeTruthy();
    expect(customer.userId).toBe('user-joao');
    expect(customer.defaultAddressId).toBe('my-addresses-id');
  });

  it('should throw NotFoundException if customers does not exist', async () => {
    const updateDTO: UpdateCustomerDto = {
      defaultAddressId: 'my-addresses-id',
    };

    await expect(
      updateCustomerUseCase.execute({
        userId: 'non-existent-user',
        dto: updateDTO,
      }),
    ).rejects.toThrow('Customer not found for this user');
  });
});
