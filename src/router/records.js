import { body } from 'express-validator';
import express from 'express';
import 'express-async-errors';

import * as recordsController from '../controller/records.js';
import { validate as validation } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

/*
  [ MVC ( View ) ]
*/

const router = express.Router();

const validateRecords = [
  body('cusid').trim().notEmpty().withMessage('cusid input Characters error (back-end)'),
  body('addname').trim().notEmpty().withMessage('addname input Characters error (back-end)'),
  body('dong').trim().notEmpty().isLength({ min: 1, max: 5 }).withMessage('dong input Characters error (back-end)'),
  body('ho').trim().notEmpty().isLength({ min: 1, max: 5 }).withMessage('ho input Characters error (back-end)'),
  validation
];

router.get('/date', isAuth, recordsController.searchByDate);

router.get('/', isAuth, recordsController.searchByCustomer);

router.post('/', isAuth, validateRecords, recordsController.createRecord);

router.delete('/:id', isAuth, recordsController.deleteRecord);

export default router;
