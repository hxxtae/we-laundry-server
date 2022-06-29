import MongoDB from 'mongodb';
import { getProductSales } from '../db/database.js';

export async function getAllOne(username) {
  return getProductSales(username)
    .findOne()
    .then(mapOptionalSales);
}

export async function reCompositionProductSales(id, saleArr = [], laundryArr = [], username) {
  if (!(laundryArr.length)) return;
  const copyLaundry = [...laundryArr]; // 나중에 sale 에 추가할 품목들
  const productSales = [...saleArr];

  const updateSales = productSales.map((obj) => {
    const laundryIdx = copyLaundry.findIndex((laundry) => laundry.productId === obj.productId);
    if (laundryIdx === -1) return obj;

    const { productId, productName, count, price } = copyLaundry[laundryIdx];
    copyLaundry.splice(laundryIdx, 1);
    return {
      productId,
      productName,
      count: obj.count + count,
      price: obj.price + price,
    };
  });

  const newSales = updateSales.concat(...copyLaundry);
  
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
