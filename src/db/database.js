// MongoDB Node Driver

// MongoDB Connection
import MongoDB from 'mongodb';
import { config } from '../config.js';

let db;
export async function connectDB() {
  return MongoDB.MongoClient.connect(config.mongo.host)
    .then((client) => {
      db = client.db();
    });
}

export function getUsers() {
  return db.collection('users'); // users 이름은 MongoDB Atlas에서 자동으로 대문자로 변경된다.
}
