import { Password } from '@core/users/value-objects/password';

describe('Password', () => {
  it('Should be able t create a valid password', () => {
    const password = Password.create('myPassword123');
    expect(password.value()).toBeTruthy();
  });

  it('Should be able to throw if password is too short', () => {
    expect(() => Password.create('123')).toThrow(
      'Password must be at least 6 characters long',
    );
  });

  it('Should be an instance of Password', () => {
    const password = Password.create('aValidPassword');

    expect(password).toBeInstanceOf(Password);
  });

  it('Should not leak value on toString', () => {
    const password = Password.create('Secret123');
    expect(password.toString()).toBe('[Password]');
  });
});
