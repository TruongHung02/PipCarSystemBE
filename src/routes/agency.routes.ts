import { requireLogin, requireRole, validateRequest } from '@pippip/pip-system-common';
import express from 'express';
import {
  blockAgency,
  createAgency,
  getAgencyDetail,
  getAgencyList,
  unblockAgency,
  updateAgencyDetail,
} from '../controllers/agency.controllers';
import { createAgencyValidator, updateAgencyValidator } from '../middleware/agency.validator';

const router = express.Router();

router.get(
  '/agency',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  // queryAgencyListValidator,
  validateRequest,
  getAgencyList,
);
router.get('/agency/detail/:agencyId', requireLogin, requireRole(['ADMIN', 'PM']), getAgencyDetail);

router.post(
  '/agency',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  createAgencyValidator,
  validateRequest,
  createAgency,
);
router.put(
  '/agency/update_info/:agencyId',
  requireLogin,
  requireRole(['ADMIN', 'PM']),
  updateAgencyValidator,
  validateRequest,
  updateAgencyDetail,
);

router.put('/agency/block/:agencyId', requireLogin, requireRole(['ADMIN', 'PM']), blockAgency);
router.put('/agency/unblock/:agencyId', requireLogin, requireRole(['ADMIN', 'PM']), unblockAgency);

export default router;
