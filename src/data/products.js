import MongoDB from 'mongodb';
import { getProducts } from '../db/database.js';

/*
  [ MVC ( Model ) ]
*/
export async function getAll(username) {
  return getProducts(username)
    .find()
    .sort({ _id: -1 })
    .toArray()
    .then(mapProducts);
}

export async function findById(id, username) {
  return getProducts(username)
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalProducts);
}

export async function findByName(categoryName, username) {
  return getProducts(username)
    .findOne({ categoryName })
    .then(mapOptionalProducts);
}

/* create */
export async function createToCategory(categoryName, username) {
  const productObj = {
    categoryName,
    products: [],
    createAt: new Date().toLocaleDateString("en-US"),
  };
  return getProducts(username)
    .insertOne(productObj)
    .then((data) => mapOptionalProducts({ ...productObj, _id: data.insertedId }));
}

export async function createToProduct(id, productName, price, username) {
  return getProducts(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) },
      {
        $push: {
          products: {
            productId: Date.now(),
            productName,
            price,
          }
        }
      },
      { returnDocument: 'after'}
    )
    .then((result) => result.value)
    .then(mapOptionalProducts);
}

/* update */
export async function categoryToUpdate(id, categoryName, username) {
  return getProducts(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) },
      { $set: { categoryName } },
      { returnDocument: 'after'}
    )
    .then((result) => result.value)
    .then(mapOptionalProducts);
}

export async function productToUpdate(id, products, username) {
  return getProducts(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) },
      { $set: { products } },
      { returnDocument: 'after'}
    )
    .then((result) => result.value)
    .then(mapOptionalProducts);
}

/* delete */
export async function categoryToRemove(id, username) {
  return getProducts(username)
    .deleteOne({ _id: new MongoDB.ObjectId(id) });
}

function mapOptionalProducts(product) {
  return product && { ...product, id: product._id.toString() };
}

function mapProducts(products) {
  return products.map(mapOptionalProducts);
}