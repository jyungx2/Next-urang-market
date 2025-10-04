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
    // ✅ 세션에서 userId 획득
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const userId = session.user.id; // ✅ 세션에서 userId 가져오기

    // 1) 현재 로그인 유저 정보 가져오기
    const user = await getDocumentById(client, "users", userId); // 🌟projection 지정 안 함 → user document 전체 가져옴

    // 2) 좋아요/싫어요 Set 생성 (문자열 변환해서 ObjectId 비교 문제 방지)
    // 💡 좋아요/싫어요 GET 요청에서는 likes와 dislikes 두 필드가 모두 필요하다. projection으로 이 두가지 프라퍼티만 뽑아 가져오는 것도 가능하지만, 문서 크기가 작아 성능상 차이가 거의 없기 때문에, projection을 생략하고 전체 도큐먼트를 가져오는 쪽을 선택했다.

    // projection으로도 likes와 dislikes를 동시에 가져올 수 있다.
    // { projection: { likes: 1, dislikes: 1 } }
    // ❓ 그럼 왜 projection을 안 썼을까?
    // 사실 이건 성능 최적화 vs 코드 단순성 트레이드오프
    //  ✅ projection을 쓰는 경우
    // 장점: 불필요한 필드를 안 가져오므로 네트워크 비용, 메모리 사용을 조금이라도 줄임. -> 하지만, 유저 도큐먼트는 보통 가볍기 때문에 성능 차이가 체감될만큼 크지 않아서 코드 단순성을 택한 것!
    // 단점: 호출할 때마다 { likes: 1, dislikes: 1 }를 일일이 적어줘야 함 → 코드가 장황해짐.

    // ✅ projection을 생략하는 경우
    // 장점: getDocumentById(client, "users", userId)처럼 간단.
    // 단점: nickname, email, createdAt 같은 필요 없는 필드도 함께 가져옴.

    // 💥 반면, products GET 요청에서는 wishlist만 필요하니까 projection으로 wishlist만 가져옴
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
