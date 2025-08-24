import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('SocialLink', () => {
  it('Should be able to create a social link', () => {
    const link = new SocialLink('https://www.youtube.com/meu-canal');

    expect(link).toBeTruthy();
    expect(link.value).toBe('https://www.youtube.com/meu-canal');
    expect(link.provider).toBe('youtube');
  });

  it('Should be able return an error', () => {
    expect(() => new SocialLink('invalid-url')).toThrow('Invalid URL');
  });

  it('Should be able return error if url not equal provider', () => {
    expect(() => new SocialLink('https://notasupported.com/perfil')).toThrow(
      'Provider does not supported',
    );
  });
});
