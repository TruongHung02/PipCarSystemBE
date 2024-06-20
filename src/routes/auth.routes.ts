import { validateRequest } from '@pippip/pip-system-common';
import { Router } from 'express';
import { requireLoginSession } from '../controllers/auth.controllers';
import { refreshTokenValidator, userSignInValidator } from '../middleware/auth.validator';

import { refreshAccessToken, userLogin, userLogout } from '../controllers/auth.controllers';

const router = Router();

router.post('/auth/pip/login', userSignInValidator, validateRequest, userLogin);
router.post('/auth/pip/logout', requireLoginSession, userLogout);
router.post(
  '/auth/pip/refresh_token',
  requireLoginSession,
  // requireRole(['ADMIN', 'PM']),
  refreshTokenValidator,
  validateRequest,
  refreshAccessToken,
);

export default router;
