import { InMemoryCreatorRepository } from '@test/in-memory-creator.repository';
import { CreateCreatorUseCase } from '@application/creator/use-case/create-creator.use-case';
import { FindCreatorByUserIdUseCase } from '@application/creator/use-case/find-creator-by-user-id.use-case';
import { SocialLink } from '@core/creators/value-objects/social-link.vo';

describe('Find creator byUserId', () => {
  it('Should return creator by userId', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const createCreatorUseCase = new CreateCreatorUseCase(creatorRepository);
    const findCreatorByUserIdUseCase = new FindCreatorByUserIdUseCase(
      creatorRepository,
    );

    const dto = {
      userId: '123456',
      bio: 'Eu sou um criador',
      socialLinks: [new SocialLink('youtube', 'https://youtube.com/meu-canal')],
    };

    await createCreatorUseCase.execute(dto);

    const result = await findCreatorByUserIdUseCase.execute({
      userId: '123456',
    });

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
    expect(result.userId).toBe('123456');
    expect(result.socialLinks).toHaveLength(1);
  });

  it('should throw an error if no creator is found by userId', async () => {
    const creatorRepository = new InMemoryCreatorRepository();
    const findCreatorByUserIdUseCase = new FindCreatorByUserIdUseCase(
      creatorRepository,
    );

    const userId = '123456';

    await expect(
      findCreatorByUserIdUseCase.execute({ userId }),
    ).rejects.toThrow(`User with userId ${userId} not found`);
  });
});
