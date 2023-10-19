import { Router } from 'express';
import { authRouter } from './auth/auth.router';
import { usersRouter } from './users/users.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

export { router };
