import { InMemoryCreatorRepository } from '@test/in-memory-creator.repository';
import { UpdateCreatorUseCase } from '@application/creator/use-cases/update-creator.use-case';
import { CreateCreatorUseCase } from '@application/creator/use-cases/create-creator.use-case';

describe('Creator Update Use Case', () => {
  const creatorRepository = new InMemoryCreatorRepository();
  const createCreatorUseCase = new CreateCreatorUseCase(creatorRepository);
  const updateCreatorUseCase = new UpdateCreatorUseCase(creatorRepository);

  it('should update creator details', async () => {
    const dto = {
      userId: 'user-joao',
      bio: 'Old bio',
      socialLinks: [],
    };

    await createCreatorUseCase.execute(dto);

    const { creator } = await updateCreatorUseCase.execute({
      userId: 'user-joao',
      dto: {
        bio: 'Meu nome é João e sou developer',
        socialLinks: [
          'https://youtube.com/meu-canal',
          'https://linkedin.com/in/meu-perfil',
        ],
      },
    });

    expect(creator).toBeTruthy();
    expect(creator.userId).toBe('user-joao');
    expect(creator.bio).toBe('Meu nome é João e sou developer');
    expect(creator.socialLinks).toHaveLength(2);
    expect(creator.socialLinks[0].value).toBe('https://youtube.com/meu-canal');
    expect(creator.socialLinks[1].value).toBe(
      'https://linkedin.com/in/meu-perfil',
    );
  });

  it('should throw NotFoundException if creator does not exist', async () => {
    await expect(
      updateCreatorUseCase.execute({
        userId: 'non-existent-user',
        dto: {
          bio: 'Meu nome é João e sou developer',
        },
      }),
    ).rejects.toThrow('Criador não encontrado para este usuário.');
  });
});
