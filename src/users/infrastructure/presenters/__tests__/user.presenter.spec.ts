import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from '../user.presenter';

describe('UsersPresenter - unit tests', () => {
  const createdAt = new Date();
  let props = {
    id: '697bf08e-1755-463d-b65f-4ccfc64abb55',
    name: 'test name',
    email: 'a@a.com',
    password: 'fakepassword',
    createdAt,
  };

  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });

  it('should be defined', () => {
    const output = instanceToPlain(sut);

    expect(output).toStrictEqual({
      id: '697bf08e-1755-463d-b65f-4ccfc64abb55',
      name: 'test name',
      email: 'a@a.com',
      createdAt: createdAt.toISOString(),
    });
  });
});
