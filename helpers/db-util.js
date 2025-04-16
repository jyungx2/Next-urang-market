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

export async function getDocumentsByKeyword(client, collection, keyword) {
  const db = client.db(process.env.MONGODB_NAME);

  // 예시: 소재지(전체 주소, full) 또는 다른 필드 (예: 시도, 읍면동)를 기준으로 검색
  // 여기서는 "full" 필드를 기준으로 regex 검색
  return await db
    .collection(collection)
    .find({
      full: { $regex: keyword, $options: "i" }, // 대소문자 무시
      isActive: true,
    })
    .limit(100)
    .toArray();
}
