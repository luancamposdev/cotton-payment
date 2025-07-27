import { Password } from '@core/shared/value-objects/password';
import { PasswordHash } from '@core/shared/value-objects/password-hash';

describe('Password Hash', () => {
  it('Should be able to create a hash from a valid password', async () => {
    const password = Password.create('myPassword123');
    const hash = await PasswordHash.fromPassword(password);

    expect(hash).toBeInstanceOf(PasswordHash);
    expect(hash.value()).toMatch(/^\$2[aby]?\$/);
  });

  it('Should be able to compare a valid password with its hash', async () => {
    const password = Password.create('secreteTest123');
    const hashed = await PasswordHash.fromPassword(password);

    const result = await hashed.compare(password);

    expect(result).toBeTruthy();
  });

  it('Should return false when comparing with incorrect password', async () => {
    const original = Password.create('ValidPassword');
    const hashed = await PasswordHash.fromPassword(original);

    const wrong = Password.create('NotValidPassword');
    const result = await hashed.compare(wrong);

    expect(result).toBe(false);
  });

  it('Should be able to create from an existing valid hash', () => {
    const hash = '$2b$10$012345678901234567890u1IDDoTovtGPXrS3IAVRhTwIfhVssVm2';
    const hashed = PasswordHash.fromHash(hash);

    expect(hashed).toBeInstanceOf(PasswordHash);
    expect(hashed.value()).toBe(hash);
  });
});
