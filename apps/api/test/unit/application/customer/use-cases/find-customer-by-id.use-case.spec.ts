import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { FindCustomerByIdUseCase } from '@application/customer/use-case/find-customer-by-id.use-case';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';

describe('Find creator by id', () => {
  it('Should return customers by id', async () => {
    const customerRepository = new InMemoryCustomerRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const findCustomerByIdUseCase = new FindCustomerByIdUseCase(
      customerRepository,
    );

    const result = await createCustomerUseCase.execute({
      userId: '123456',
      defaultAddressId: 'addresses-1234567',
    });

    const { customer } = await findCustomerByIdUseCase.execute({
      id: result.customer.id,
    });

    expect(customer).toBeTruthy();
    expect(customer).toBeDefined();
    expect(customer.userId).toBe('123456');
    expect(customer.defaultAddressId).toBe('addresses-1234567');
  });

  it('should throw an error if no customers is found by userId', async () => {
    const customerRepository = new InMemoryCustomerRepository();
    const findCustomerByIdUseCase = new FindCustomerByIdUseCase(
      customerRepository,
    );

    const id = '123456';

    await expect(findCustomerByIdUseCase.execute({ id })).rejects.toThrow(
      'Não foi encontrado o cliente',
    );
  });
});
