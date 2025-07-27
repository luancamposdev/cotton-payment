import { Name } from '@core/users/value-objects/name';

describe('Name', () => {
  it('Should be able to create a valid name', () => {
    const name = Name.create('Luan Campos');

    expect(name).toBeTruthy();
  });

  it('Should be able to remove extra spaces on the edges', () => {
    const name = Name.create('   Luan Campos   ');

    expect(name.value).toEqual('Luan Campos');
  });

  it('Should be able to throw a error if name has only one word', () => {
    expect(() => Name.create('Luan')).toThrow(
      'Invalid name. please enter valid name.',
    );
  });
});
