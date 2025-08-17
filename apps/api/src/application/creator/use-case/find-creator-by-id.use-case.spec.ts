import { InMemoryCreatorRepository } from '@test/in-memory-creator.repository';
import { FindCreatorByIdUseCase } from '@application/creator/use-case/find-creator-by-id.use-case';
import { CreatorsEntity } from '@core/creators/creators.entity';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('Find creator by id', () => {
  it('Should find a creator by id', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const findCreatorById = new FindCreatorByIdUseCase(creatorRepository);

    const creator = new CreatorsEntity({
      userId: 'user-123',
      bio: 'Eu sou um criador',
      socialLinks: [new SocialLink('youtube', 'https://youtube.com/meu-canal')],
    });

    await creatorRepository.create(creator);

    const foundCreator = await findCreatorById.execute(creator.id);

    expect(foundCreator).toBeTruthy();
    expect(foundCreator.id).toBe(creator.id);
    expect(foundCreator.socialLinks).toHaveLength(1);
  });

  it('Should return null if creator does not exist', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const findCreatorUseCase = new FindCreatorByIdUseCase(creatorRepository);

    await expect(findCreatorUseCase.execute('non-existent-id')).rejects.toThrow(
      'Usuário criador de conteúdo não encontrado.',
    );
  });
});
