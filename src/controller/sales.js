import * as salesRepository from '../data/sales.js';

export async function searchProductSale(req, res, next) {
  const sales = await salesRepository.getAllOne(req.userName);
  res.status(200).json(sales);
}

// NOTE: PostMan 테스트용
export async function createProductSale(req, res, next) {
  const sales = await salesRepository.createProductSales(req.userName);
  res.status(201).json(sales);
}
