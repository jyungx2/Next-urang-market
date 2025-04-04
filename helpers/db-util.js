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
