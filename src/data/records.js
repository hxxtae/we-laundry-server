import MongoDB from 'mongodb';
import { getRecords } from '../db/database.js';

/*
  [ MVC ( Model ) ]
*/
export async function getAll(username) {
  return getRecords(username)
    .find()
    .sort({ _id: -1 })
    .toArray()
    .then(mapRecords);
}

export async function findById(id, username) {
  return getRecords(username)
    .findOne({ _id: new MongoDB.ObjectId(id) })
    .then(mapOptionalRecords);
}

export async function findRecordsByDate(recordDate, username) {
  return getRecords(username)
    .find({ recordDate })
    .sort({ recordDate: -1, _id: -1 })
    .toArray()
    .then(mapRecords);
}

export async function findRecordsByDong(addname, dong, username) {
  return getRecords(username)
    .find({ addname, dong })
    .sort({ recordDate: -1, _id: -1 })
    .toArray()
    .then(mapRecords);
}

export async function findRecordsByDongAndHo(addname, dong, ho, username) {
  return getRecords(username)
    .find({ addname, dong, ho })
    .sort({ recordDate: -1, _id: -1 })
    .toArray()
    .then(mapRecords);
}

/* create */
export async function create(recordDate, recordCount, recordPrice, cusid, addid, addname, dong, ho, addfullname, laundry, repair, username) {
  const recordObj = {
    recordDate,
    recordCount,
    recordPrice,
    cusid,
    addid,
    addname,
    dong,
    ho,
    addfullname,
    records: {
      laundry: [...laundry],
      repair: [...repair],
    }
  };
  getRecords(username)
    .insertOne(recordObj)
    .then((data) => mapOptionalRecords({ ...recordObj, _id: data.insertedId }));
}

/* update */
export async function updateCustomerOfRecord(id, cusid, addid, addname, dong, ho, addfullname, username) {
  return getRecords(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) },
      {
        $set: {
          cusid,
          addid,
          addname,
          dong,
          ho,
          addfullname,
        }
      },
      { returnDocument: 'after' }
    )
    .then((result) => result.value)
    .then(mapOptionalRecords);
}

export async function updateProductsOfRecord(id, recordCount, recordPrice, laundry, repair, username) {
  return getRecords(username)
    .findOneAndUpdate(
      { _id: new MongoDB.ObjectId(id) },
      {
        $set: {
          recordCount,
          recordPrice,
          records: {
            laundry,
            repair,
          }
        }
      },
      { returnDocument: 'after' }
    )
    .then((result) => result.value)
    .then(mapOptionalRecords);
}

export async function manyUpdateByAddress(addid, addname, addfullname, username) {
  return getRecords(username)
    .updateMany(
      { addid }, // 조건: 해당 주소id 인 모든 데이터
      { $set: { addname, addfullname } },
      { returnDocument: 'after' }
    );
}

export async function manyUpdateByCustomer(cusid, addid, addname, addfullname, dong, ho, username) {
  return getRecords(username)
    .updateMany(
      { cusid }, // 조건: 해당 주소id 인 모든 데이터
      { $set: { addid, addname, addfullname, dong, ho } },
      { returnDocument: 'after' }
    );
}

/* delete */
export async function removeRecord(id, username) {
  return getRecords(username)
    .deleteOne({ _id: new MongoDB.ObjectId(id) });
}

export async function manyRemoveRecordByAddid(addid, username) {
  return getRecords(username)
    .deleteMany({ addid });
}

export async function manyRemoveRecordByCusid(cusid, username) {
  return getRecords(username)
    .deleteMany({ cusid });
}

function mapOptionalRecords(record) {
  return record && { ...record, id: record._id.toString() };
}

function mapRecords(records) {
  return records.map(mapOptionalRecords);
}
