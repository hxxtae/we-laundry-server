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
  body('name').trim().notEmpty() && body('name').trim().notEmpty().isLength({ min: 2, max: 10 }).withMessage('name input Characters error (back-end)'),
  body('dong').trim().notEmpty().isLength({ min: 2, max: 5 }).withMessage('dong input Characters error (back-end)'),
  validation
];

router.post('/', isAuth, customerController.createCustomer);

router.get('/', isAuth, customerController.getCustomer);

router.get('/:name', isAuth, customerController.searchByName);

router.get('/:addname/:dong', isAuth, customerController.searchByDong);

router.get('/:addname/:dong/:ho', isAuth, customerController.searchByDongAndHo);

router.put('/:id', isAuth, customerController.updateCustomer);

router.delete('/:id', isAuth, customerController.deleteCustomer);

export default router;
