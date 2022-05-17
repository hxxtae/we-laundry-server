import { body } from 'express-validator';
import express from 'express';
import 'express-async-errors';

import * as addressController from '../controller/address.js';
import { validate as validation } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

/*
  [ MVC ( View ) ]
*/

const router = express.Router();

const validateAddress = [
  body('addname').trim().notEmpty().isLength({ min: 2, max: 10 }).withMessage('addname input Characters error (back-end)'),
  validation
];

router.post('/', isAuth, validateAddress, addressController.createAddress);

router.get('/', isAuth, addressController.getAddress);

router.put('/:id', isAuth, addressController.updateAddress);

router.delete('/:id', isAuth, addressController.deleteAddress);

export default router;
