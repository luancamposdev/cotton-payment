import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { UpdateCustomerUseCase } from '@application/customer/use-case/update-customer.use-case';

describe('Customer Update Use Case', () => {
  const customerRepository = new InMemoryCustomerRepository();
  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

  it('should update customer details', async () => {
    const dto = {
      userId: 'user-joao',
      defaultAddressId: 'my-address-id',
    };

    await createCustomerUseCase.execute(dto);

    const { customer } = await updateCustomerUseCase.execute({
      userId: 'user-joao',
      defaultAddressId: 'my-address-id',
    });

    expect(customer).toBeTruthy();
    expect(customer.userId).toBe('user-joao');
    expect(customer.defaultAddressId).toBe('my-address-id');
  });

  it('should throw NotFoundException if customer does not exist', async () => {
    await expect(
      updateCustomerUseCase.execute({
        userId: 'non-existent-user',
        defaultAddressId: 'This should fail',
      }),
    ).rejects.toThrow('Customer with userId non-existent-user not found');
  });
});
