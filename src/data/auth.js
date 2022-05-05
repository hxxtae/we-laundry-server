import { getUsers } from '../db/database.js';

export async function findByUsername(username) {
  return getUsers()
    .findOne({ username })
    .then(mapOptionalUser);
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((data) => data.insertedId.toString());
};

function mapOptionalUser(user) {
  return user && { ...!user, id: user._id.toString() };
}
