import { Router } from 'express';
import {
  changePasswordController,
  loginController,
  loginWithAuth0Controller,
  registerController,
  registerWithAuth0Controller,
} from '../../../controllers';
import { authMiddleware } from '../../../middlewares';

const authRouter = Router();

authRouter.post(
  '/register/auth0',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => registerWithAuth0Controller.execute(req, res)
);

authRouter.post('/login/auth0', async (req, res) =>
  loginWithAuth0Controller.execute(req, res)
);

authRouter.post('/register', async (req, res) =>
  registerController.execute(req, res)
);

authRouter.post('/login', async (req, res) =>
  loginController.execute(req, res)
);

authRouter.put(
  '/change-password',
  async (req, res, next) => authMiddleware.execute(req, res, next),
  async (req, res) => changePasswordController.execute(req, res)
);

export { authRouter };
