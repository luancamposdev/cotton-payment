import {
  CustomerEntity,
  ICustomer,
} from '@core/customer/entities/customer.entity';

describe('Customer Entity', () => {
  it('should create a customers entity with provided props', () => {
    const props: ICustomer = {
      userId: 'userId-123',
      defaultAddressId: 'address-456',
    };

    const customer = new CustomerEntity(props);

    expect(customer).toBeTruthy();
    expect(customer.userId).toBe('userId-123');
    expect(customer.defaultAddressId).toBe('address-456');
  });

  it('Should allow defaultAddressId to be null', () => {
    const props: ICustomer = {
      userId: 'userId-123',
      defaultAddressId: null,
    };

    const customer = new CustomerEntity(props);

    customer.defaultAddressId = null;
    expect(customer.defaultAddressId).toBeNull();
  });

  it('Should use provided createdAt and updatedAt if given', () => {
    const now = new Date('2025-08-23T12:00:00Z');
    const customerProps: ICustomer = {
      userId: 'user-123',
      defaultAddressId: 'addresses-456',
      createdAt: now,
      updatedAt: now,
    };

    const customer = new CustomerEntity(customerProps);

    expect(customer.createdAt).toBe(now);
    expect(customer.updatedAt).toBe(now);
  });
});
