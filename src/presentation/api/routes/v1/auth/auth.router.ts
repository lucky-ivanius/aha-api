import { Router } from 'express';
import { loginWithAuth0Controller } from '../../../../../infrastructure/di/controllers/auth/login-with-auth0.controller';
import { loginController } from '../../../../../infrastructure/di/controllers/auth/login.controller';
import { registerController } from '../../../../../infrastructure/di/controllers/auth/register.controller';

const authRouter = Router();

authRouter.post('/login/auth0', async (req, res) =>
  loginWithAuth0Controller.execute(req, res)
);

authRouter.post('/login', async (req, res) =>
  loginController.execute(req, res)
);

authRouter.post('/register', async (req, res) =>
  registerController.execute(req, res)
);

export { authRouter };
