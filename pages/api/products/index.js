import { ObjectId } from "mongodb";
import {
  connectDatabase,
  getAllDocuments,
  getDocumentById,
  insertDocument,
} from "../../../helpers/db-util";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { get } from "react-hook-form";

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
  // GET (상품 목록 + userHasWished)
  if (req.method === "GET") {
    // ✅ 세션에서 userId 획득
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const userId = session.user.id; // ✅ 세션에서 userId 가져오기

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
      let wishlistSet = new Set();

      // 2) 로그인한 유저의 wishlist 가져오기
      if (userId) {
        const user = await getDocumentById(client, "users", userId, {
          wishlist: 1, // 여기서 1은 wishlist 필드를 포함한다는 뜻
        });

        if (user?.wishlist?.length > 0) {
          // 💡 new Set()의 인자는 반복 가능한(iterable) 자료형이어야 함
          // 배열/문자열/Set/Map 등은 모두 iterable but, 객체/숫자는 iterable이 아님
          wishlistSet = new Set(user.wishlist.map((id) => String(id)));
        }
      }

      const documents = await getAllDocuments(
        client,
        "products",
        { _id: -1 },
        filter
      );

      // 채팅방 중에서 해당 물건에 대한 채팅방만 필터링
      const chatRooms = await getAllDocuments(client, "chatRooms");

      // 3) userHasWished 필드 추가
      const productsWithWish = documents.map((product) => ({
        ...product,
        wishCount: product.wishCount || 0, // wishCount가 없을 경우 0으로 초기화
        userHasWished: wishlistSet.has(String(product._id)),
        chatRoomsCount: chatRooms.filter(
          (room) => String(room.productId) === String(product._id)
        ).length, // 해당 상품에 대한 채팅방 개수
      }));

      res.status(200).json({ products: productsWithWish });
    } catch (err) {
      res.status(500).json({ message: "Getting posts failed!" });
    }
  }

  client.close();
  return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
}
