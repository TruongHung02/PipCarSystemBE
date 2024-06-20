import { body } from 'express-validator';

export const createAgencyValidator = [
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
  body('code')
    .trim()
    .isLength({ max: 6, min: 6 })
    .withMessage('Code must be equal 6 characters long')
    .isNumeric()
    .withMessage('Code must not contains special characters'),
  body('isTransportation').isBoolean().withMessage('Invalid isTransportation type'),
  body('isDriver').isBoolean().withMessage('Invalid isDriver type'),
  body('rank').isNumeric().withMessage('Invalid rank type'),
  body('point').isNumeric().withMessage('Invalid point type'),
  body('lat_address').isString().withMessage('Invalid lat_address type'),
  body('long_address').isString().withMessage('Invalid long_address type'),
  body('lat').isString().withMessage('Invalid lat type'),
  body('long').isString().withMessage('Invalid long type'),
  body('updated_gps_time').optional().isNumeric().withMessage('Invalid updated_gps_time type'),
];

export const updateAgencyValidator = [
  body('phone').optional().trim().isMobilePhone(['vi-VN']).withMessage('Invalid phone number'),
  body('name')
    .optional()
    .isAlpha('vi-VN', { ignore: ' ' })
    .withMessage('Name must not contains special characters'),
  body('code')
    .optional()
    .trim()
    .isLength({ max: 6, min: 6 })
    .withMessage('Code must be equal 6 characters long')
    .isNumeric()
    .withMessage('Code must not contains special characters'),
  body('isTransportation').optional().isBoolean().withMessage('Invalid isTransportation type'),
  body('isDriver').optional().isBoolean().withMessage('Invalid isDriver type'),
  body('rank').optional().isNumeric().withMessage('Invalid rank type'),
  body('point').optional().isNumeric().withMessage('Invalid point type'),
  body('lat_address').optional().isString().withMessage('Invalid lat_address type'),
  body('long_address').optional().isString().withMessage('Invalid long_address type'),
  body('lat').optional().isString().withMessage('Invalid lat type'),
  body('long').optional().isString().withMessage('Invalid long type'),
  body('updated_gps_time').optional().isNumeric().withMessage('Invalid updated_gps_time type'),
];
