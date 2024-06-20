import { body } from 'express-validator';

export const createDriverValidator = [
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isAlpha('vi-VN', { ignore: ' ' })
    .withMessage('Name must not contains special characters'),
  body('license_id').isString().withMessage('Invalid license_id type'),
  body('address').isString().withMessage('Invalid address type'),
  body('lat_address').isString().withMessage('Invalid lat_address type'),
  body('long_address').isString().withMessage('Invalid long_address type'),
  body('lat').isString().withMessage('Invalid lat type'),
  body('long').isString().withMessage('Invalid long type'),
  body('updated_gps_time').optional().isNumeric().withMessage('Invalid updated_gps_time type'),
];
