import { Validation } from '../../../http/common/validation';
import {
  GetUserListValidation,
  getUserListValidationSchema,
} from '../../../http/validations/users/get-user-list.validation';

export const getUserListValidation = new Validation<GetUserListValidation>(
  getUserListValidationSchema
);
