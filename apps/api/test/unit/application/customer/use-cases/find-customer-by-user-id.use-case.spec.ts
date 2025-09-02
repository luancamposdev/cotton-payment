import { InMemoryCustomerRepository } from '@test/in-memory-customer.repository';
import { CreateCustomerUseCase } from '@application/customer/use-case/create-customer.use-case';
import { FindCustomerByUserIdUseCase } from '@application/customer/use-case/find-customer-by-user-id.use-case';

describe('Find creator byUserId', () => {
  it('Should return customers by userId', async () => {
    const customerRepository = new InMemoryCustomerRepository();
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const findCustomerByUserIdUseCase = new FindCustomerByUserIdUseCase(
      customerRepository,
    );

    const dto = {
      userId: '123456',
      defaultAddressId: 'addresses-1234567',
    };

    await createCustomerUseCase.execute(dto);

    const { customer } = await findCustomerByUserIdUseCase.execute({
      userId: '123456',
    });

    expect(customer).toBeTruthy();
    expect(customer).toBeDefined();
    expect(customer.userId).toBe('123456');
    expect(customer.defaultAddressId).toBe('addresses-1234567');
  });

  it('should throw an error if no customers is found by userId', async () => {
    const customerRepository = new InMemoryCustomerRepository();
    const findCustomerByUserIdUseCase = new FindCustomerByUserIdUseCase(
      customerRepository,
    );

    const userId = '123456';

    await expect(
      findCustomerByUserIdUseCase.execute({ userId }),
    ).rejects.toThrow('Não foi encontrado o cliente');
  });
});
