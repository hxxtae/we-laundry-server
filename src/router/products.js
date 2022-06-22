import { body } from 'express-validator';
import express from 'express';
import 'express-async-errors';

import * as productsController from '../controller/products.js';
import { validate as validation } from '../middleware/validator.js';
import { isAuth } from '../middleware/auth.js';

/*
  [ MVC ( View ) ]
*/

const router = express.Router();

const validateCategory = [
  body('categoryName').trim().notEmpty().isLength({ min: 1, max: 8 }).withMessage('categoryName input Characters error (back-end)'),
  validation
];

const validateProduct = [
  body('productName').trim().notEmpty().isLength({ min: 1, max: 10 }).withMessage('productName input Characters error (back-end)'),
  body('price').notEmpty().isLength({ min: 1, max: 7 }).withMessage('price input Characters error (back-end)'),
  validation
];

router.post('/', isAuth, validateCategory, productsController.createCategory);
router.put('/create/:id', isAuth, validateProduct, productsController.createProduct);

router.get('/', isAuth, productsController.getProducts);

router.put('/:id', isAuth, productsController.updateCategory);
router.put('/update/:id', isAuth, productsController.updateProduct);

router.delete('/:id', isAuth, productsController.deleteCategory);

export default router;
