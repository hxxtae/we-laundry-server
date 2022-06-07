import * as productsRepository from '../data/products.js';

/*
  [ MVC ( Controller ) ]
*/
/*
==============================
  get all products
==============================
*/
export async function getProducts(req, res, next) {
  const products = await productsRepository.getAll(req.userName);
  res.status(200).json(products);
}

/*
==============================
  create product
==============================
*/
export async function createCategory(req, res, next) {
  const { categoryName } = req.body;

  const found = await productsRepository.findByName(categoryName, req.userName);
  if (found) {
    return res.status(409).json({ message: `${categoryName} 는(은) 이미 존재합니다.` });
  }
  
  const productObj = await productsRepository.createToCategory(categoryName, req.userName);
  res.status(200).json(productObj);
}

export async function createProduct(req, res, next) {
  const { productName, price } = req.body;
  const id = req.params.id;

  const found = await productsRepository.findById(id, req.userName);
  if (!found) {
    return res.status(404).json({ message: `ProductObj(Category) id(${id}) not found` });
  }
  
  const productObj = await productsRepository.createToProduct(id, productName, price, req.userName);
  res.status(200).json(productObj);
}

/*
==============================
  update product
==============================
*/
export async function updateCategory(req, res, next) {
  const { categoryName } = req.body;
  const id = req.params.id;

  const found = await productsRepository.findById(id, req.userName);
  if (!found) {
    return res.status(404).json({ message: `ProductObj(Category) id(${id}) not found` });
  }

  const productObj = await productsRepository.categoryToUpdate(id, categoryName, req.userName);
  return res.status(200).json(productObj);
}

export async function updateProduct(req, res, next) {
  const { products } = req.body;
  const id = req.params.id;

  const found = await productsRepository.findById(id, req.userName);
  if (!found) {
    return res.status(404).json({ message: `ProductObj(Category) id(${id}) not found` });
  }

  const productObj = await productsRepository.productToUpdate(id, products, req.userName);
  return res.status(200).json(productObj);
}

/*
==============================
  delete product
==============================
*/
export async function deleteCategory(req, res, next) {
  const id = req.params.id;
  const found = await productsRepository.findById(id, req.userName);
  if (!found) {
    return res.status(404).json({ message: `ProductObj(Category) id(${id}) not found` });
  }

  const deleted = await productsRepository.categoryToRemove(id, req.userName);
  res.status(204).json(deleted);
}
