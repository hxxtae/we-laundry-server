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

export function getCustomer(username) {
  return db.collection(`${username}_Customer`);
};

export function getProducts(username) {
  return db.collection(`${username}_Products`);
};

export function getRecords(username) {
  return db.collection(`${username}_Records`);
};

export function getProductSales(username) {
  return db.collection(`${username}_Product_Sales`);
};

export function getMonthSales(username) {
  return db.collection(`${username}_Month_Sales`);
};

export function getYearSales(username) {
  return db.collection(`${username}_Year_Sales`);
};

export function setUserCollection(username) {
  // Address
  db.createCollection(`${username}_Address`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Address Collection created!`);
  });

  // Customer
  db.createCollection(`${username}_Customer`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Customer Collection created!`);
  });

  // Products
  db.createCollection(`${username}_Products`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Products Collection created!`);
  });

  // Records
  db.createCollection(`${username}_Records`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Records Collection created!`);
  });

  // Sales
  db.createCollection(`${username}_Product_Sales`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Product_Sales Collection created!`);
  });

  db.createCollection(`${username}_Month_Sales`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Month_Sales Collection created!`);
  });

  db.createCollection(`${username}_Year_Sales`, (err, res) => {
    if (err) throw err;
    console.log(`${username}_Year_Sales Collection created!`);
  });
};
