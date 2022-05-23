import MongoDB from 'mongodb';
import { setUserCollection, getUsers } from '../db/database.js';

/*
  [ MVC ( Model ) ]
*/
export async function findByUsername(username) { // 단건 조회
  return getUsers()
    .findOne({ username })
    .then(mapOptionalUser);
}

export async function findById(id) { // 단건 조회
  return getUsers()
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalUser);
}

export async function createUser(user) { // 단건 입력
  return getUsers()
    .insertOne(user)
    .then((data) => data.insertedId.toString());
};

function mapOptionalUser(user) {
  return user && { ...user, id: user._id.toString() };
}

export async function createUserCollection(username) {
  setUserCollection(username);
}
