import { MongoClient, ObjectId } from "mongodb";

export async function connectDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db(process.env.MONGODB_NAME);
  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getAllDocuments(client, collection, sort, filter = {}) {
  const db = client.db(process.env.MONGODB_NAME);

  const documents = await db
    .collection(collection)
    .find(filter)
    .sort(sort)
    .toArray();

  return documents;
}

export async function getDocumentById(client, collection, id) {
  const db = client.db(process.env.MONGODB_NAME);
  const document = await db
    .collection(collection)
    .findOne({ _id: new ObjectId(id) });
  return document;
}

export async function deleteDocumentById(client, collection, id) {
  const db = client.db(process.env.MONGODB_NAME);
  const deletedResult = await db
    .collection(collection)
    .deleteOne({ _id: new ObjectId(id) });
  return deletedResult;
}

export async function getDocumentsByKeyword(client, collection, keyword) {
  const db = client.db(process.env.MONGODB_NAME);

  // ✨ 핵심: 입력값을 공백으로 나누고, 각 단어를 모두 포함하는 주소 찾기
  const terms = keyword.trim().split(/\s+/); // 예: ["서울", "강남"]

  const regexConditions = terms.map((term) => ({
    full: { $regex: term, $options: "i" },
  }));
  // 예시: 소재지(전체 주소, full) 또는 다른 필드 (예: 시도, 읍면동)를 기준으로 검색
  // 여기서는 "full" 필드를 기준으로 regex 검색
  return await db
    .collection(collection)
    .find({
      $and: [
        { isActive: true },
        ...regexConditions, // AND 조건으로 모든 키워드 포함
      ],
    })
    .limit(100)
    .toArray();
}
