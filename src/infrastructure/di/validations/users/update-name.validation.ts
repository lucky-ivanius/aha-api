import { Validation } from '../../../http/common/validation';
import {
  UpdateNameValidation,
  updateNameValidationSchema,
} from '../../../http/validations/users/update-name.validation';

export const updateNameValidation = new Validation<UpdateNameValidation>(
  updateNameValidationSchema
);
