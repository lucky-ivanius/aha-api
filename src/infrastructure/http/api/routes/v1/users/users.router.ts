import { Router } from 'express';
import {
  getCurrentUserDetailController,
  getUserListController,
  getUserStatisticController,
  updateCurrentUserNameController,
  verifyEmailController,
} from '../../../controllers';
import { authMiddleware } from '../../../middlewares';

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
  async (req, res) => updateCurrentUserNameController.execute(req, res)
);

usersRouter.get(
  '/stats',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => getUserStatisticController.execute(req, res)
);

usersRouter.get('/verify', async (req, res) =>
  verifyEmailController.execute(req, res)
);

export { usersRouter };
