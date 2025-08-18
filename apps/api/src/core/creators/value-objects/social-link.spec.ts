import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('SocialLink', () => {
  it('Should be able to create a social link', () => {
    const link = new SocialLink('https://www.youtube.com/meu-canal');

    expect(link).toBeTruthy();
    expect(link.value).toBe('https://www.youtube.com/meu-canal');
    expect(link.provider).toBe('youtube');
  });

  it('deve lançar erro se a URL for inválida', () => {
    expect(() => new SocialLink('url-invalida')).toThrow('URL inválida');
  });

  it('deve lançar erro se a URL não corresponder ao provedor', () => {
    expect(() => new SocialLink('https://notasupported.com/perfil')).toThrow(
      'Provider não suportado',
    );
  });
});
