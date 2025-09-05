import { InMemoryCreatorRepository } from '@test/in-memory-creator.repository';
import { CreateCreatorUseCase } from '@application/creator/use-cases/create-creator.use-case';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('Creator creator useCase', () => {
  it('Should return the creator creator', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const createCreatorUseCase = new CreateCreatorUseCase(creatorRepository);

    const dto = {
      userId: '123456',
      bio: 'Eu sou um criador',
      socialLinks: [new SocialLink('https://youtube.com/meu-canal').value],
    };

    const { creator } = await createCreatorUseCase.execute(dto);

    expect(creator).toBeTruthy();
    expect(creator.socialLinks).toHaveLength(1);
  });

  it('Do not create a duplicate creator for the same userId', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const createCreatorUseCase = new CreateCreatorUseCase(creatorRepository);

    const dto = {
      userId: 'user-123',
    };

    await createCreatorUseCase.execute(dto);

    await expect(createCreatorUseCase.execute(dto)).rejects.toThrow(
      'Criador já cadastrado para este usuário',
    );
  });
});
