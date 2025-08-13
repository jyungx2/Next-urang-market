import { connectDatabase } from "@/helpers/db-util";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  // PUT / DELETE 외에는 차단
  if (req.method !== "PUT" && req.method !== "DELETE") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  // 1. 인증된 유저 가져오기
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const userId = session.user.id;

  // 2. DB 연결
  let client;
  try {
    client = await connectDatabase();
  } catch (err) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  const { productId } = req.body;
  if (!productId) {
    res.status(422).json({ message: "Invalid input - productId" });
    client.close();
    return;
  }

  // 3) wishlist에 상품 추가 (중복 방지)
  if (req.method === "PUT") {
    const db = client.db(process.env.MONGODB_NAME);

    try {
      // 유저의 wishilist에 상품 아이디 추가
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $addToSet: { wishlist: productId },
        }
      );

      // 상품의 wishlistCount 증가
      const productResult = await db.collection("products").findOneAndUpdate(
        {
          _id: new ObjectId(productId),
        },
        {
          $inc: { wishCount: 1 }, //  해당 필드가 없을 경우 자동으로 생성하고 값도 지정해줘서 api/products POST 요청시 따로 추가할 필요 X
        },
        {
          returnDocument: "after", // 업데이트하기 전 문서가 아니라 업데이트가 적용된 "이후(after)"의 문서를 반환
        }
      );

      return res.status(200).json({
        message: "위시리스트에 추가됨",
        userHasWished: true,
        wishCount: productResult.wishCount,
      });
    } catch (err) {
      res.status(500).json({ message: "Adding to wishlist failed!" });
      return;
    }
  }

  // 4) wishlist에서 상품 제거
  if (req.method === "DELETE") {
    const db = client.db(process.env.MONGODB_NAME);

    try {
      // 유저의 wishilist에 상품 아이디 삭제
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $pull: { wishlist: productId },
        }
      );

      // 상품의 wishlistCount 감소
      const productResult = await db.collection("products").findOneAndUpdate(
        {
          _id: new ObjectId(productId),
        },
        {
          $inc: { wishCount: -1 }, //  해당 필드가 없을 경우 자동으로 생성하고 값도 지정해줘서 api/products POST 요청시 따로 추가할 필요 X
        },
        {
          returnDocument: "after", // 업데이트하기 전 문서가 아니라 업데이트가 적용된 "이후(after)"의 문서를 반환
        }
      );

      return res.status(200).json({
        message: "위시리스트에서 제거됨",
        userHasWished: false,
        wishCount: productResult.wishCount,
      });
    } catch (err) {
      res.status(500).json({ message: "Removing from wishlist failed!" });
      return;
    }
  }

  client.close();
}
