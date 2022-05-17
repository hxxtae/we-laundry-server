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
};

export function getUsers() {
  return db.collection('users');
};

export function getAddress(username) {
  return db.collection(`${username}_Address`);
};

export function setUserCollection(username) {
  db.createCollection(`${username}_Customer`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Customer Collection created!`);
  });
  db.createCollection(`${username}_Address`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Address Collection created!`);
  });
  db.createCollection(`${username}_Order`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Order Collection created!`);
  });
  db.createCollection(`${username}_OrderSs`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_OrderSs Collection created!`);
  });
  db.createCollection(`${username}_Products`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Products Collection created!`);
  });
  db.createCollection(`${username}_Sales`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Sales Collection created!`);
  });
};
