import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';

describe('Create Customer useCase', () => {
  it('Should return the customer', async () => {
    const customerRepository = new InMemoryCustomerRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    const dto = {
      userId: 'userId-123456',
      defaultAddressId: 'address-1234567',
    };

    const { customer } = await createCustomerUseCase.execute(dto);

    expect(customer).toBeTruthy();
    expect(customer.defaultAddressId).toBe('address-1234567');
  });

  it('Do not create a duplicate customer for the same userId', async () => {
    const customerRepository = new InMemoryCustomerRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    const dto = {
      userId: 'user-123',
    };

    await createCustomerUseCase.execute(dto);

    await expect(createCustomerUseCase.execute(dto)).rejects.toThrow(
      'Customer já cadastrado para este usuário',
    );
  });
});
