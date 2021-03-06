import MongoDB from 'mongodb';
import { getCustomer } from '../db/database.js';

/*
  [ MVC ( Model ) ]
*/
export async function findById(id, username) {
  return getCustomer(username)
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalCustomer);
}

export async function findByAddId(addid, dong, ho, username) {
  return getCustomer(username)
    .findOne({ addid, dong, ho })
    .then(mapOptionalCustomer);
}

export async function findByDongAndHo(addname, dong, ho, username) {
  return getCustomer(username)
    .find({ addname, dong, ho })
    .sort({ dong: 1, ho: 1 })
    .toArray()
    .then(mapCustomer);
}

export async function findByDong(addname, dong, username) {
  return getCustomer(username)
    .find({ addname, dong })
    .sort({ dong: 1, ho: 1 })
    .toArray()
    .then(mapCustomer);
}

export async function findByAddname(addname, username) {
  return getCustomer(username)
    .find({ addname })
    .sort({ dong: 1, ho: 1 })
    .toArray()
    .then(mapCustomer);
}

export async function findByNames(name, username) {
  return getCustomer(username)
    .find({ name: { $regex: name } })
    .sort({ _id: -1 })
    .toArray()
    .then(mapCustomer);
}

export async function getAll(username) {
  return getCustomer(username)
    .find()
    .sort({ _id: -1 })
    .toArray()
    .then(mapCustomer);
}

export async function create(addid, addname, addfullname, name, dong, ho, username) {
  const cus = {
    addid,
    addname,
    addfullname,
    name,
    dong,
    ho,
    createdAt: new Date().toLocaleDateString("ko-KR"),
  }
  return getCustomer(username)
    .insertOne(cus)
    .then((data) => mapOptionalCustomer({ ...cus, _id: data.insertedId }));
}

export async function update(addid, addname, addfullname, name, dong, ho, id, username) {
  return getCustomer(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) }, // 업데이트할 대상 선택
      { $set: { addid, addname, addfullname, name, dong, ho } },
      { returnDocument: 'after' } // before: 업데이트 이전 값 반환, after: 업데이트 이후 값 반환
    )
    .then((result) => result.value)
    .then(mapOptionalCustomer);
}

export async function manyUpdate(addid, addname, addfullname, username) {
  return getCustomer(username)
    .updateMany(
      { addid }, // 조건: 해당 주소id 인 모든 데이터
      { $set: { addname, addfullname } },
      { returnDocument: 'after' }
    );
}

export async function remove(id, username) {
  return getCustomer(username)
    .deleteOne({ _id: new MongoDB.ObjectId(id) });
}

export async function manyRemoveCustomerByAddid(addid, username) {
  return getCustomer(username)
    .deleteMany({ addid });
}

function mapOptionalCustomer(cus) {
  return cus && { ...cus, id: cus._id.toString() };
}

function mapCustomer(cuss) {
  return cuss.map(mapOptionalCustomer);
}
