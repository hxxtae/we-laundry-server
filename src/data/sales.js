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
export async function reCompositionProductSales(laundryArr = [], username, addChk) {
  if (!(laundryArr.length)) return;
  if (addChk == undefined) return;

  const productSalesFindOne = await getAllOne(username);
  if (!productSalesFindOne) return;
  const { id, productStats } = productSalesFindOne;

  const copyLaundry = [...laundryArr]; // NOTE: productStats 에 Add 및 Remove할 품목 리스트 (주문 접수 or 주문 내역 품목 리스트)
  const copyProductStats = [...productStats]; // NOTE: productStats 전체 품목 리스트 (전체 품목 누적 리스트)

  const updateProductStats = productSaleRelocation(copyProductStats, copyLaundry, addChk);
  
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

function findMatchLaundryIdx(laundryArr, findProductId) {
  return laundryArr.findIndex((laundry) => laundry.productId === findProductId);
}

function productAddOfSales() {
  
}

function productRemoveOfSales() {

}

// NOTE: 주문 접수 시 Sales에 누적 품목 통계 추가 / 주문 내역 삭제 시 Sales에 누적 품목 통계 삭제
// -> 추가 / 삭제 관심사를 분리해 주어야 한다.
function productSaleRelocation(productStats, laundryArr, addChk) {
  const copyLaundry = [...laundryArr];
  const removeLaundry = [];
  const newProductStats = productStats.map((saleObj) => {
    const findLaundryIdx = findMatchLaundryIdx(copyLaundry, saleObj.productId);
    if (findLaundryIdx === -1) return saleObj;

    const { categoryId, categoryName, productId, productName, count, price } = copyLaundry[findLaundryIdx];
    copyLaundry.splice(findLaundryIdx, 1);
    let [setCount, setPrice] = [0, 0];
    
    if (addChk) {
      setCount = parseInt(saleObj.count + count);
      setPrice = parseInt(saleObj.price + price);
    } else {
      setCount = parseInt(saleObj.count - count);
      setPrice = parseInt(saleObj.price - price);
      if (setCount <= 0 || setPrice <= 0) {
        removeLaundry.push(productId);
      }
    }

    return {
      categoryId,
      categoryName,
      productId,
      productName,
      count: setCount,
      price: setPrice,
    };
  });

  if (addChk) {
    return newProductStats.concat(...copyLaundry);
  }
  return newProductStats.filter((productObj) => !removeLaundry.includes(productObj.productId));
}

