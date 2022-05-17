import * as addressRepository from '../data/address.js';

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
  const found = await addressRepository.getByAddname(addname, req.userName)
  if (found) {
    return res.status(409).json({ message: `${addname} 는 이미 사용중입니다.` });
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
  
  const updated = await addressRepository.update(addname, addfullname, id, req.userName);
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
  res.status(204).json(deleted);
}
