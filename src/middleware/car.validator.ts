import { body } from 'express-validator';

export const createCarValidator = [
  body('plates').exists().trim().withMessage('Plates is required'),
  body('type').isString().withMessage('Invalid type'),
  body('name').exists({ checkFalsy: true }).withMessage('Name is required'),
  body('lat').isString().withMessage('Invalid lat type'),
  body('long').isString().withMessage('Invalid long type'),
  body('updated_gps_time').optional().isNumeric().withMessage('Invalid updated_gps_time type'),
];
