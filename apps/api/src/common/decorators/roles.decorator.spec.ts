import 'reflect-metadata';
import { ROLES_KEY, Roles } from './roles.decorator';
import { Role } from '@core/users/entities/user.entity';

describe('Roles Decorator', () => {
  it('should set metadata with provided roles', () => {
    class TestClass {
      @Roles(Role.ADMIN, Role.CUSTOMER) testMethod() {}
    }

    const roles = Reflect.getMetadata(
      ROLES_KEY,
      TestClass.prototype,
      'testMethod',
    ) as Role[];

    expect(roles).toEqual([Role.ADMIN, Role.CUSTOMER]);
  });
});
