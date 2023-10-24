import { Router } from 'express';
import { changeAuth0PasswordController } from '../../../../../infrastructure/di/controllers/users/change-auth0-password.controller';
import { changePasswordController } from '../../../../../infrastructure/di/controllers/users/change-password.controller';
import { getCurrentUserDetailController } from '../../../../../infrastructure/di/controllers/users/get-current-user-detail.controller';
import { getUserListController } from '../../../../../infrastructure/di/controllers/users/get-user-list.controller';
import { getUserStatisticController } from '../../../../../infrastructure/di/controllers/users/get-user-statistic.controller';
import { updateCurrentNameController } from '../../../../../infrastructure/di/controllers/users/update-current-name.controller';
import { verifyEmailController } from '../../../../../infrastructure/di/controllers/users/verify-email.controller';
import { authMiddleware } from '../../../../../infrastructure/di/middlewares/auth.middleware';

const usersRouter = Router();

usersRouter.get(
  '/',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => getUserListController.execute(req, res)
);

usersRouter.get(
  '/me',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => getCurrentUserDetailController.execute(req, res)
);

usersRouter.patch(
  '/me',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => updateCurrentNameController.execute(req, res)
);

usersRouter.get(
  '/statistic',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => getUserStatisticController.execute(req, res)
);

usersRouter.get('/verify', async (req, res) =>
  verifyEmailController.execute(req, res)
);

usersRouter.put(
  '/password',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => changePasswordController.execute(req, res)
);

usersRouter.put(
  '/password/auth0',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => changeAuth0PasswordController.execute(req, res)
);

export { usersRouter };
