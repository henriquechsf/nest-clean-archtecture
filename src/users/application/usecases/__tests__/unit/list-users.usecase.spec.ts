import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { ListUsersUseCase } from "../../list-users.usecase";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/entities/testing/helpers/user-data-builder";

describe('ListUsersUseCase unit tests', () => {
  let sut: ListUsersUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUseCase.UseCase(repository);
  });

  describe('toOutput method', () => {
    it('should convert an SearchResult in output', () => {
      let result = new UserRepository.SearchResult({
        items: [],
        total: 1,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null
      })

      let output = sut['toOutput'](result)

      expect(output).toStrictEqual({
        items: [],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 2,
      })

      const entity = new UserEntity(UserDataBuilder({}))

      result = new UserRepository.SearchResult({
        items: [entity],
        total: 1,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null
      })

      output = sut['toOutput'](result)

      expect(output).toStrictEqual({
        items: [entity.toJson()],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 2,
      })
    });
  })
});
