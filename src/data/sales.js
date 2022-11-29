import MongoDB from 'mongodb';
import { getProductSales } from '../db/database.js';

export async function getAllOne(username) {
  return getProductSales(username)
    .findOne()
    .then(mapOptionalSales);
}

/*
========================================
  productStats of Update (add & remove)
========================================
*/
export async function reCompositionProductSales(laundryArr = [], username, addChk = true) {
  if (!(laundryArr.length)) return;

  const productSalesFindOne = await getAllOne(username);
  const { id, productStats } = productSalesFindOne;

  const copyLaundry = [...laundryArr]; // sale 에 (추가 및 차감)할 품목들
  const copyProductStats = [...productStats]; // sale
  const removeLaundry = []; // sale 에서 제외할 품목들

  const updateSales = productSaleRelocation(copyProductStats, copyLaundry, removeLaundry, addChk);

  const updateProductStats = addChk ?
    updateSales.concat(...copyLaundry) : // add
    updateSales.filter((obj) => !removeLaundry.includes(obj.productId)); // remove
  
  return getProductSales(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) },
      {
        $set: {
          productStats: updateProductStats,
        }
      },
      { returnDocument: 'after' }
    )
    .then((result) => result.value)
    .then(mapOptionalSales);
}

/*
=========================
  productStats of Insert
=========================
*/
export async function createProductSales(username) {
  const productSaleObj = {
    productStats: [],
  }
  return getProductSales(username)
    .insertOne(productSaleObj)
    .then((data) => mapOptionalSales({ ...productSaleObj, _id: data.insertedId }));
}

/*
---------------------------
  Util Function
---------------------------
*/
function mapOptionalSales(sale) {
  return sale && { ...sale, id: sale._id.toString() };
}

function mapSales(sales) {
  return sales.map(mapOptionalSales);
}

function productSaleRelocation(saleArr, laundryArr, removeArr, addChk) {
  const newSales = saleArr.map((saleObj) => {
    const laundryIdx = laundryArr.findIndex((laundry) => laundry.productId === saleObj.productId);
    if (laundryIdx === -1) return saleObj;

    const { productId, productName, count, price } = laundryArr[laundryIdx];
    laundryArr.splice(laundryIdx, 1);

    let setCount = 0;
    let setPrice = 0;
    if (addChk) {
      setCount = parseInt(saleObj.count + count);
      setPrice = parseInt(saleObj.price + price);
    } else {
      setCount = parseInt(saleObj.count - count);
      setPrice = parseInt(saleObj.price - price);

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
