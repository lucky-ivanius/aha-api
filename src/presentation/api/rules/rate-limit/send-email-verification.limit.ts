import rateLimit from 'express-rate-limit';

const duration = 30 * 1000; // 30 seconds

export const sendEmailVerificationLimit = rateLimit({
  windowMs: duration,
  max: 1,
  keyGenerator: (req) => {
    return req.auth!.userId;
  },
});
