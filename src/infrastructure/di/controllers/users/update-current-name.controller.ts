import { UpdateCurrentNameController } from '../../../http/controllers/users/update-current-name.controller';
import { updateNameUseCase } from '../../use-cases/users/update-name.use-case';
import { updateNameValidation } from '../../validations/users/update-name.validation';

export const updateCurrentNameController = new UpdateCurrentNameController(
  updateNameUseCase,
  updateNameValidation
);
