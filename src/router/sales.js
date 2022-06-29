import { body } from 'express-validator';
import express from 'express';
import 'express-async-errors';

import * as salesController from '../controller/sales.js';
import { isAuth } from '../middleware/auth.js';

/*
  [ MVC ( View ) ]
*/

const router = express.Router();

router.get('/', isAuth, salesController.searchProductSale);

router.post('/', isAuth, salesController.createProductSale);

export default router;
