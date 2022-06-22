import * as recordsRepository from '../data/records.js';

/*
  [ MVC ( Controller ) ]
*/
/*
==============================
  get records by Date
==============================
*/
export async function searchByDate(req, res, next) {
  console.log('search Date in Records');
  const recordDate = req.params.recordDate;

  const recordObjs = await recordsRepository.findRecordsByDate(recordDate, req.userName);
  res.status(200).json(recordObjs);
}

/*
==============================
  get records by Dong
==============================
*/
export async function searchByDong(req, res, next) {
  console.log('search Dong in Records');
  const addname = req.params.addname;
  const dong = req.params.dong;

  const recordObjs = await recordsRepository.findRecordsByDong(addname, dong, req.userName);
  res.status(200).json(recordObjs);
}

/*
==============================
  get records by Dong and Ho
==============================
*/
export async function searchByDongAndHo(req, res, next) {
  console.log('search Dong And Ho in Records');
  const addname = req.params.addname;
  const dong = req.params.dong;
  const ho = req.params.ho;

  const recordObjs = await recordsRepository.findRecordsByDongAndHo(addname, dong, ho, req.userName);
  res.status(200).json(recordObjs);
}

/*
==============================
  create record
==============================
*/
export async function createRecord(req, res, next) {
  const {
    recordCount, /* 주문개수 (number) */
    recordPrice, /* 주문가격 (number) */
    cusid, /* 고객id */
    addid, /* 주소id */
    addname, /* 주소이름 */
    dong, /* 동  */
    ho, /* 호  */
    addfullname, /* 주소상세이름 */
    laundry, /* 세탁 주문 (array) */
    repair /* 수선 개수 (array) */
  } = req.body;
  
  const recordObj = await recordsRepository
    .create(
      recordCount,
      recordPrice,
      cusid,
      addid,
      addname,
      dong,
      ho,
      addfullname,
      laundry,
      repair,
      req.userName
    );
  
  res.status(201).json(recordObj);
}

/*
==============================
  delete record
==============================
*/
export async function deleteRecord(req, res, next) {
  const id = req.params.id;
  const found = await recordsRepository.findById(id, req.userName);
  if (!found) {
    return res.status(404).json({ message: `RecordObj id(${id}) not found` });
  }  

  const deleted = await recordsRepository.removeRecord(id, req.userName);
  res.status(204).json(deleted);
}

