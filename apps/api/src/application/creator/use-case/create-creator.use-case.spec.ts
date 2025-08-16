import { InMemoryCreatorRepository } from '@test/in-memory-creator.repository';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('Creator creator useCase', () => {
  it('Should return the creator creator', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const createUserUseCase = new CreateCreatorUseCase(creatorRepository);

    const dto = {
      userId: '123456',
      bio: 'Eu sou um criador',
      socialLinks: [new SocialLink('youtube', 'https://youtube.com/meu-canal')],
    };

    const creator = await createUserUseCase.execute(dto);

    expect(creator).toBeTruthy();
    expect(creator.socialLinks).toHaveLength(1);
  });

  it('Do not create a duplicate creator for the same userId', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const createUserUseCase = new CreateCreatorUseCase(creatorRepository);

    const dto = {
      userId: 'user-123',
    };

    await createUserUseCase.execute(dto);

    await expect(createUserUseCase.execute(dto)).rejects.toThrow(
      'Creator já cadastrado para este usuário',
    );
  });
});
