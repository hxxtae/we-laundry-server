import { body } from 'express-validator';
import express from 'express';
import 'express-async-errors';

import * as authsController from '../controller/auth.js';
import { validate as validation } from '../middleware/validator.js';

const router = express.Router();

// Login input-check
const validateCredential = [
  body('username').trim().notEmpty().isLength({ min: 2, max: 12 }).withMessage('usename input Characters error (back-end)'),
  body('password').trim().isLength({ min: 8, max: 18 }).withMessage('password input Characters error (back-end)'),
  validation
];

// Signup input-check
const validateSingup = [
  ...validateCredential,
  body('tel').notEmpty().withMessage('tel is missing (back-end)'),
  validation
];

router.post('/signup', validateSingup, authsController.signup);

router.get('/csrf-token', authsController.csrfToken);

export default router;
