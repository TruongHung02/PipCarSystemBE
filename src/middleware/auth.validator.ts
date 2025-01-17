import { BadRequestError } from '@pippip/pip-system-common';
import { body } from 'express-validator';

export const userSignInValidator = [
  body('phone')
    .exists()
    .withMessage('Phone is required')
    .trim()
    .isMobilePhone(['vi-VN'])
    .withMessage('Invalid phone number'),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isAlphanumeric()
    .withMessage('Password must not contains special characters'),
];

export const refreshTokenValidator = [
  body('refresh_token')
    .exists()
    .withMessage('Refresh Token is required')
    .custom((value) => {
      if (value === 'EMPTY') {
        throw new BadRequestError('Invalid Token');
      }
      return true;
    }),
];
