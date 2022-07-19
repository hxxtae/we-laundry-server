import MongoDB from 'mongodb';
import { getProductSales } from '../db/database.js';

export async function getAllOne(username) {
  return getProductSales(username)
    .findOne()
    .then(mapOptionalSales);
}

/*
====================================
  productSale update (add & remove)
====================================
*/
export async function reCompositionProductSales(id, saleArr = [], laundryArr = [], username, chk) {
  if (!(laundryArr.length)) return;
  const copyLaundry = [...laundryArr]; // sale 에 (추가 및 차감)할 품목들
  const productSales = [...saleArr]; // sale
  const removeLaundry = []; // sale 에서 제외할 품목들

  const updateSales = productSaleRelocation(productSales, copyLaundry, removeLaundry, chk);

  const newSales = chk ?
    updateSales.concat(...copyLaundry) : 
    updateSales.filter((obj) => !removeLaundry.includes(obj.productId));
  
  return getProductSales(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) },
      {
        $set: {
          productStats: newSales,
        }
      },
      { returnDocument: 'after' }
    )
    .then((result) => result.value)
    .then(mapOptionalSales);
}

export async function createProductSales(username) {
  const productSaleObj = {
    productStats: [],
  }
  return getProductSales(username)
    .insertOne(productSaleObj)
    .then((data) => mapOptionalSales({ ...productSaleObj, _id: data.insertedId }));
}



function mapOptionalSales(sale) {
  return sale && { ...sale, id: sale._id.toString() };
}

function mapSales(sales) {
  return sales.map(mapOptionalSales);
}

function productSaleRelocation(saleArr, laundryArr, removeArr, chk) {
  const newSales = saleArr.map((obj) => {
    const laundryIdx = laundryArr.findIndex((laundry) => laundry.productId === obj.productId);
    if (laundryIdx === -1) return obj;

    const { productId, productName, count, price } = laundryArr[laundryIdx];
    laundryArr.splice(laundryIdx, 1);

    let setCount = 0;
    let setPrice = 0;
    if (chk) {
      setCount = parseInt(obj.count + count);
      setPrice = parseInt(obj.price + price);
    } else {
      setCount = parseInt(obj.count - count);
      setPrice = parseInt(obj.price - price);

      if ((setCount <= 0) || (setPrice <= 0)) {
        removeArr.push(productId);
      }
    }

    return {
      productId,
      productName,
      count: setCount,
      price: setPrice,
    };
  });

  return newSales;
}
