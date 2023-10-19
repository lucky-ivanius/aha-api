import { addHours } from 'date-fns';
import { Id } from '../../../common/id';
import { Session, SessionProps } from '../session';

describe('models:session - Session (Model)', () => {
  const id = new Id();
  const validProps: SessionProps = {
    userId: id,
    token: '1234',
    expiryDate: addHours(new Date(), 24),
  };

  describe('create', () => {
    it('should pass for a valid session', () => {
      const result = Session.create(validProps);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toBeInstanceOf(Session);
      expect(result.data.userId).toEqual(validProps.userId);
      expect(result.data.token).toEqual(validProps.token);
      expect(result.data.expiryDate).toEqual(validProps.expiryDate);
      expect(result.data.isActive).toBeTruthy();
    });
  });
});
