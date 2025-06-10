import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserOutputMapper } from '../user-output';

describe('UserOutputMapper unit tests', () => {
  it('should convert an user in output', () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const spyToJson = jest.spyOn(entity, 'toJson');

    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled()
    expect(sut).toStrictEqual(entity.toJson())
  });
});
