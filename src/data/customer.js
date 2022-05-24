import MongoDB from 'mongodb';
import { getCustomer } from '../db/database.js';

/*
  [ MVC ( Model ) ]
*/
export async function findByDongAndHo(addname, dong, ho, username) {
  return getCustomer(username)
    .findOne({addname, dong, ho})
    .then(mapOptionalCustomer);
}

export async function findByName(name, username) {
  return getCustomer(username)
    .findOne({ name })
    .then(mapOptionalCustomer);
}

export async function findById(id, username) {
  return getCustomer(username)
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalCustomer);
}

export async function findByDong(addname, dong, username) {
  return getCustomer(username)
    .find({ addname, dong })
    .sort({ _id: -1 })
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

export async function create(addname, addfullname, name, dong, ho, username) {
  const cus = {
    addname,
    addfullname,
    name,
    dong,
    ho,
    createdAt: new Date().toLocaleDateString(),
  }
  return getCustomer(username)
    .insertOne(cus)
    .then((data) => mapOptionalCustomer({ ...cus, _id: data.insertedId }));
}

export async function update(name, addname, addfullname, dong, ho, id, username) {
  return getCustomer(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) }, // 업데이트할 대상 선택
      { $set: { name, addname, addfullname, dong, ho } },
      { returnDocumnet: 'after' } // before: 업데이트 이전 값 반환, after: 업데이트 이후 값 반환
    )
    .then((result) => result.value)
    .then(mapOptionalCustomer);
}

export async function remove(id, username) {
  return getCustomer(username)
    .deleteOne({ _id: new MongoDB.ObjectId(id) });
}

function mapOptionalCustomer(cus) {
  return cus && { ...cus, id: cus._id.toString() };
}

function mapCustomer(cuss) {
  return cuss.map(mapOptionalCustomer);
}
