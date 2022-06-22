import * as customerRepository from '../data/customer.js';
import * as recordsRepository from '../data/records.js';

/*
  [ MVC ( Controller ) ]
*/
/*
==============================
  get all customer
==============================
*/
export async function getCustomer(req, res, next) {
  console.log('search All');
  const cuss = await customerRepository.getAll(req.userName);
  res.status(200).json(cuss);
}

/*
==============================
  create customer
==============================
*/
export async function createCustomer(req, res, next) {
  const { addid, addname, addfullname, name, dong, ho } = req.body;

  const found = await customerRepository.findByAddId(addid, dong, ho, req.userName);

  if (found) {
    return res.status(409).json({ message: `${addname + ', ' + dong + ', ' + ho} 는(은) 이미 사용중입니다.` });
  }
  const cus = await customerRepository.create(addid, addname, addfullname, name, dong, ho, req.userName);
  res.status(201).json(cus);
}

/*
==============================
  search customers (name)
  -> Not used it
==============================
*/
export async function searchByName(req, res, next) {
  console.log('search Name');
  const name = req.params.name;
  
  const cuss = await customerRepository.findByNames(name, req.userName);
  res.status(200).json(cuss);
}

/*
==============================
  search customers (addname)
==============================
*/
export async function searchByAddname(req, res, next) {
  console.log('search Addname');
  const addname = req.params.addname;
  
  const cuss = await customerRepository.findByAddname(addname, req.userName);
  res.status(200).json(cuss);
}

/*
==============================
  search customers (addname, dong)
==============================
*/
export async function searchByDong(req, res, next) {
  console.log('search Dong');
  const addname = req.params.addname;
  const dong = req.params.dong;
  
  const cuss = await customerRepository.findByDong(addname, dong, req.userName);
  res.status(200).json(cuss);
}

/*
==============================
  search customer (addname, dong, ho)
==============================
*/
export async function searchByDongAndHo(req, res, next) {
  console.log('search Dong And Ho');
  const addname = req.params.addname;
  const dong = req.params.dong;
  const ho = req.params.ho;
  
  const cuss = await customerRepository.findByDongAndHo(addname, dong, ho, req.userName);
  res.status(200).json(cuss);
}

/*
==============================
  update customer (name & addid, dong, ho)
==============================
*/
export async function updateCustomer(req, res, next) {
  const { addid, addname, addfullname, name, dong, ho } = req.body;
  const id = req.params.id;

  const found = await customerRepository.findById(id, req.userName);
  if (!found) {
    return res.status(404).json({message: `Customer id(${id}) not found`});
  }

  const found2 = await customerRepository.findByAddId(addid, dong, ho, req.userName);  
  if (found2) {
    return res.status(409).json({ message: `${name || addname + ', ' + dong + ', ' + ho} 는(은) 이미 존재하는 고객입니다.` });
  }

  const updated = await customerRepository.update(addid, addname, addfullname, name, dong, ho, id, req.userName);
  await recordsRepository.manyUpdateByCustomer(id, addid, addname, addfullname, dong, ho, req.userName); // customer in records 데이터 일관성 유지
  return res.status(200).json(updated);
}

/*
==============================
  delete customer
==============================
*/
export async function deleteCustomer(req, res, next) {
  const id = req.params.id;
  const found = await customerRepository.findById(id, req.userName);
  if (!found) {
    return res.status(404).json({message: `Customer id(${id}) not found`});
  }
  
  const deleted = await customerRepository.remove(id, req.userName);
  await recordsRepository.manyRemoveRecordByCusid(id, req.userName); // customer in records 데이터 일관성 유지
  res.status(204).json(deleted);
}
