import { getServerSession } from "next-auth/next";
import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
  getDocumentById,
} from "../../../helpers/db-util";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
      writer,
      profileImage,
      title,
      content,
      mainCategory,
      subCategory,
      dong,
      rcode,
    } = req.body;
    console.log(req.query);

    // Validation for server-side
    if (
      !writer ||
      !profileImage ||
      !content ||
      !mainCategory ||
      !subCategory ||
      !dong ||
      !rcode
    ) {
      res.status(422).json({ message: "Invalid input - post" });
      client.close();
      return;
    }

    const newPost = {
      writer,
      profileImage,
      title,
      content,
      mainCategory,
      subCategory,
      createdAt: new Date(),
      dong,
      rcode,
      likesCount: 0,
      dislikesCount: 0,
    };

    let result;
    try {
      result = await insertDocument(client, "posts", newPost);
      newPost._id = result.insertedId;
      res
        .status(201)
        .json({ message: "Added post in community page", post: newPost });
    } catch (err) {
      res.status(500).json({ message: "Inserting post failed!" });
    }
  }

  // GET HTTP
  // GET: 목록 + userHasLiked / userHasDisliked 계산
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const userId = session.user.id; // ✅ 세션에서 userId 가져오기

    // 1) 현재 로그인 유저 정보 가져오기
    const user = await getDocumentById(client, "users", userId);

    // 2) 좋아요/싫어요 Set 생성 (문자열 변환해서 ObjectId 비교 문제 방지)
    const likeSet = new Set((user.likes ?? []).map(String));
    const dislikeSet = new Set((user.dislikes ?? []).map(String));

    // 3) 요청 쿼리 스트링으로부터 필요한 정보 뽑아내서 posts 데이터 가져오기
    const { mainCategory, subCategory, rcode } = req.query;

    const filter = { mainCategory, subCategory, rcode };

    try {
      const documents = await getAllDocuments(
        client,
        "posts",
        { _id: -1 },
        filter
      );

      // 4) 각 게시글에 userHasLiked / userHasDisliked 계산해서 붙이기
      const postsWithUserStatus = documents.map((post) => ({
        ...post,
        userHasLiked: likeSet.has(String(post._id)),
        userHasDisliked: dislikeSet.has(String(post._id)),
      }));

      console.log("📦 postsWithUserStatus:", postsWithUserStatus);
      res.status(200).json({ posts: postsWithUserStatus });
    } catch (err) {
      res.status(500).json({ message: "Getting posts failed!" });
    }
  }

  client.close();
}
