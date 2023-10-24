import { Id } from '../../../common/id';
import { Session, SessionProps } from '../session';

describe('models:session - Session (Model)', () => {
  const id = new Id();
  const validProps: SessionProps = {
    userId: id,
    token: '1234',
  };

  describe('create', () => {
    it('should pass for a valid session', () => {
      const result = Session.create(validProps);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toBeInstanceOf(Session);
      expect(result.data.userId).toEqual(validProps.userId);
      expect(result.data.token).toEqual(validProps.token);
    });
  });
});
