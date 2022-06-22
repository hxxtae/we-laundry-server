import * as addressRepository from '../data/address.js';
import * as customerRepository from '../data/customer.js';
import * as recordsRepository from '../data/records.js';

/*
  [ MVC ( Controller ) ]
*/
/*
==============================
  get all address
==============================
*/
export async function getAddress(req, res, next) {
  const adds = await addressRepository.getAll(req.userName);
  res.status(200).json(adds);
}
/*
==============================
  create address
==============================
*/
export async function createAddress(req, res, next) {
  const { addname, addfullname } = req.body;
  const found = await addressRepository.getByAddname(addname, req.userName);
  if (found) {
    return res.status(409).json({ message: `${addname} 는(은) 이미 사용중입니다.` });
  }
  const add = await addressRepository.create(addname, addfullname, req.userName);
  res.status(201).json(add); 
}
/*
==============================
  update address
==============================
*/
export async function updateAddress(req, res, next) {
  const { addname, addfullname } = req.body;
  const id = req.params.id;

  const found = await addressRepository.getById(id, req.userName);
  if (!found) {
    return res.status(404).json({message: `Address id(${id}) not found`});
  }

  const found2 = await addressRepository.getByAddname(addname, req.userName);
  if (found2 && (found.addname !== addname)) {
    return res.status(409).json({ message: `${addname} 는(은) 이미 사용중입니다.` });
  }

  const updated = await addressRepository.update(addname, addfullname, id, req.userName);
  await customerRepository.manyUpdate(id, addname, addfullname, req.userName); // address in customer 데이터 일관성 유지
  await recordsRepository.manyUpdateByAddress(id, addname, addfullname, req.userName); // address in records 데이터 일관성 유지
  res.status(200).json(updated);
}
/*
==============================
  delete address
==============================
*/
export async function deleteAddress(req, res, next) {
  const id = req.params.id;
  const found = await addressRepository.getById(id, req.userName);
  if (!found) {
    return res.status(404).json({message: `Address id(${id}) not found`});
  }
  
  const deleted = await addressRepository.remove(id, req.userName);
  await customerRepository.manyRemoveCustomerByAddid(id, req.userName); // address in customer 데이터 일관성 유지
  await recordsRepository.manyRemoveRecordByAddid(id, req.userName); // address in records 데이터 일관성 유지
  res.status(204).json(deleted);
}
