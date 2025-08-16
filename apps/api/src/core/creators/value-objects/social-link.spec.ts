import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('SocialLink', () => {
  it('Should be able to create a social link', () => {
    const link = new SocialLink('youtube', 'https://www.youtube.com/meu-canal');

    expect(link).toBeTruthy();
    expect(link.value).toBe('https://www.youtube.com/meu-canal');
    expect(link.provider).toBe('youtube');
  });

  it('deve lançar erro se a URL for inválida', () => {
    expect(() => new SocialLink('instagram', 'url-invalida')).toThrow(
      'URL inválida',
    );
  });

  it('deve lançar erro se a URL não corresponder ao provedor', () => {
    expect(
      () => new SocialLink('linkedin', 'https://youtube.com/perfil'),
    ).toThrow('URL não corresponde ao provedor linkedin');
  });
});
