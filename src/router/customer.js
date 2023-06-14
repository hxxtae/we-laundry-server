import { body } from 'express-validator';
import express from 'express';
import 'express-async-errors';

import * as customerController from '../controller/customer.js';
import { validate as validation } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

/*
  [ MVC ( View ) ]
*/

const router = express.Router();

const validateCustomer = [
  body('dong').trim().notEmpty().isLength({ min: 1, max: 5 }).withMessage('dong input Characters error (back-end)'),
  body('ho').trim().notEmpty().isLength({ min: 1, max: 5 }).withMessage('ho input Characters error (back-end)'),
  validation
];

router.get('/', isAuth, customerController.searchCustomer);
router.get('/all', isAuth, customerController.getCustomer);

router.post('/', isAuth, validateCustomer, customerController.createCustomer);

router.put('/:id', isAuth, customerController.updateCustomer);

router.delete('/:id', isAuth, customerController.deleteCustomer);

export default router;
