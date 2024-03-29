import * as recordsRepository from '../data/records.js';
import * as salesRepository from '../data/sales.js';

/*
  [ MVC ( Controller ) ]
*/
/*
==============================
  get records by Date (1_Day, 1_Weeks, 1_Month)
==============================
*/
export async function searchByDate(req, res, next) {
  console.log('search Records By Date');
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(406).json({ message: '날짜는 필수 입력값 입니다.' });
  }

  const recordObjs = await recordsRepository.findRecordsByDate(startDate, endDate, req.userName);
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
  get records by Dong and Ho with queryString
==============================
*/
export async function searchByCustomer(req, res, next) {
  console.log('search Records By Customer');
  const { addname, dong, ho } = req.query;
  if (!addname) {
    return res.status(406).json({ message: '단지명은 필수 입력값 입니다.' });
  }
  if (!dong) {
    return res.status(406).json({ message: '동 주소를 입력해 주세요.' });
  }
  // search by addname dong ho
  if (ho) {
    console.log('search Dong and Ho');
    const recordsObjs = await recordsRepository.findRecordsByDongAndHo(addname, dong, ho, req.userName);
    return res.status(200).json(recordsObjs);
  }
  // search by addname dong
  console.log('search Dong');
  const recordsObjs = await recordsRepository.findRecordsByDong(addname, dong, req.userName);
  res.status(200).json(recordsObjs);
}

/*
==============================
  create record
==============================
*/
export async function createRecord(req, res, next) {
  const {
    recordDate, /* 주문날짜 (string) */
    recordCount, /* 주문개수 (number) */
    recordPrice, /* 주문가격 (number) */
    recordSale, /* 할인금액 (number) */
    recordSalePrice, /* 주문할인금액 (number) */
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
      recordDate,
      recordCount,
      recordPrice,
      recordSale,
      recordSalePrice,
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

  // 품목 통계에 데이터 반영
  salesRepository.reCompositionProductSales(laundry, req.userName, true);
  
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

  const laundry = [...found.records.laundry];
  const deleted = await recordsRepository.removeRecord(id, req.userName);

  // 품목 통계에 데이터 반영
  salesRepository.reCompositionProductSales(laundry, req.userName, false);
  
  res.status(204).json(deleted);
}

