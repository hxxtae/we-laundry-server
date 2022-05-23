import MongoDB from 'mongodb';

import { getAddress } from '../db/database.js';

/*
  [ MVC ( Model ) ]
*/
export async function getByAddname(addname, username) {
  return getAddress(username)
    .findOne({ addname })
    .then(mapOptionalAddress);
}

export async function getById(id, username) {
  return getAddress(username)
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalAddress);
}

export async function getAll(username) {
  return getAddress(username)
    .find()
    .sort({ _id: -1 })
    .toArray()
    .then(mapAddress);
}

export async function create(addname, addfullname, username) {
  const add = {
    addname,
    addfullname,
    createdAt: new Date().toLocaleDateString(),
  }
  return getAddress(username)
    .insertOne(add)
    .then((data) => mapOptionalAddress({ ...add, _id: data.insertedId }));
}

export async function update(addname, addfullname, id, username) {
  return getAddress(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) }, // 업데이트할 대상 선택
      { $set: { addname, addfullname } },
      { returnDocumnet: 'after' } // before: 업데이트 이전 값 반환, after: 업데이트 이후 값 반환
    )
    .then((result) => result.value)
    .then(mapOptionalAddress);
}

export async function remove(id, username) {
  return getAddress(username)
    .deleteOne({ _id: new MongoDB.ObjectId(id) });
}

function mapOptionalAddress(add) {
  return add && { ...add, id: add._id.toString() };
}

function mapAddress(adds) {
  return adds.map(mapOptionalAddress);
}
