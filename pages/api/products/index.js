import { ObjectId } from "mongodb";
import {
  connectDatabase,
  getAllDocuments,
  insertDocument,
} from "../../../helpers/db-util";

export default async function handler(req, res) {
  let client;

  // CONNECT TO DB
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  // POST HTTP
  if (req.method === "POST") {
    const {
      sellerId,
      writer,
      writerImage,
      productImage,
      title,
      type,
      price,
      description,
      location,
      rcode,
      placeName,
      lat,
      lng,
    } = req.body;
    console.log(req.query);

    // Validation for server-side
    if (
      !sellerId ||
      !writer ||
      !writerImage ||
      !productImage ||
      !title ||
      !type ||
      (type === "Sale" && !price) ||
      !description ||
      !location ||
      !rcode ||
      !placeName ||
      !lat ||
      !lng
    ) {
      res.status(422).json({ message: "Invalid input - post" });
      client.close();
      return;
    }

    const newProduct = {
      sellerId: new ObjectId(sellerId), // 🚨 프론트가 아닌 백엔드 파일(api routes)에서 string -> ObjectId로 변환해야 net관련 오류 발생 X
      // 1. 프론트에서 sellerId	string으로 전송 (예: "6821a4c58440811e50afb12c")
      // 2. API Route에서 처리	반드시 new ObjectId(sellerId) 로 변환해서 저장

      // 🤖: new ObjectId()는 **Node.js (MongoDB driver)**에서 제공하는 함수로, 프론트는 브라우저 환경이라 이 함수를 쓸 수 없고, 쓰려고 하면 이런 에러가 뜹니다:
      // Module not found: Can't resolve 'bson' or 'net'

      // ❓왜 이러한 변환작업이 필요한가?:
      // MongoDB에선 ObjectId 타입으로 저장하는 게 인덱싱/쿼리 최적화에 유리하고, 나중에 join 및 비교 시 오류 없음
      writer,
      writerImage,
      productImage,
      title,
      type,
      description,
      price,
      location,
      rcode,
      createdAt: new Date(),
      placeName,
      lat,
      lng,
    };

    let result;
    try {
      result = await insertDocument(client, "products", newProduct);
      newProduct._id = result.insertedId;
      res
        .status(201)
        .json({ message: "Added product in market page", product: newProduct });
    } catch (err) {
      res.status(500).json({ message: "Inserting post failed!" });
    }
  }

  // GET HTTP
  if (req.method === "GET") {
    const { rcode, keyword } = req.query;

    // if (!rcode) {
    //   client.close();
    //   return res.status(400).json({ message: "Missing rcode in query" });
    // }

    const filter = {
      ...(rcode && { rcode }),
      ...(keyword && {
        title: { $regex: keyword, $options: "i" }, // keyword가 있을 경우 대소문자 무시 + 부분일치 검색
      }),
    };

    try {
      const documents = await getAllDocuments(
        client,
        "products",
        { _id: -1 },
        filter
      );
      res.status(200).json({ products: documents });
    } catch (err) {
      res.status(500).json({ message: "Getting posts failed!" });
    }
  }

  client.close();
  return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
}
