import { Email } from '@core/shared/value-objects/email';

describe('Email', () => {
  it('Should be able to create a valid email', () => {
    const email = Email.create('luancampos@mail.com');

    expect(email).toBeDefined();
  });

  it('Should be able throws error for invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow(
      'Email addresses is invalid',
    );
    expect(() => Email.create('luan@.com')).toThrow(
      'Email addresses is invalid',
    );
    expect(() => Email.create('')).toThrow('Email addresses is invalid');
    expect(() => Email.create('luan@com')).toThrow(
      'Email addresses is invalid',
    );
  });

  it('lança erro para valores nulos ou indefinidos', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => Email.create(null as any)).toThrow();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => Email.create(undefined as any)).toThrow();
  });
});
