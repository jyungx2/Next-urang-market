import { connectDatabase, insertDocument } from "@/helpers/db-util";

async function handler(req, res) {
  // if (req.method !== "POST ") {
  //   return;
  // }

  if (req.method === "POST") {
    const data = req.body;
    const {
      location,
      username,
      birthdate,
      phoneNumber,
      profileImage,
      nickname,
      selectedLocation,
    } = data;

    if (!location) {
      res.status(422).json({ message: "거주 지역을 입력해주세요." });
      return;
    }

    if (!username) {
      res.status(422).json({ message: "이름을 입력해주세요." });
      return;
    }

    if (!birthdate) {
      res.status(422).json({ message: "생년월일을 입력해주세요." });
      return;
    }

    if (!phoneNumber) {
      res.status(422).json({ message: "전화번호를 입력해주세요." });
      return;
    }

    if (!profileImage) {
      res.status(422).json({ message: "프로필 이미지를 등록해주세요." });
      return;
    }

    if (!nickname) {
      res.status(422).json({ message: "닉네임을 입력해주세요." });
      return;
    }

    const client = await connectDatabase();
    const db = client.db(process.env.MONGODB_NAME);

    // 중복 아이디 계정 방지 로직
    const existingUser = await db
      .collection("users")
      .findOne({ username: username, phoneNumber: phoneNumber });
    // 💡 phoneNumber: phoneNumber 추가! (동명이인 가능성 o)

    if (existingUser) {
      res.status(422).json({ message: "User exists already!" });
      client.close();
      return;
    }

    // ✅ 특정 이메일은 관리자 계정으로 자동 등록
    const isAdmin = username === "김유랑"; // ← 원하는 이메일 주소 넣기

    const newUser = {
      location,
      username,
      birthdate,
      phoneNumber,
      profileImage,
      nickname,
      role: isAdmin ? "admin" : "user",
      recentLocations: [],
      selectedLocation,
    };

    try {
      const result = await insertDocument(client, "users", newUser);
      newUser._id = result.insertedId;
      res.status(201).json({ user: newUser, message: "Created User!" });
    } catch (err) {
      res.status(500).json({ message: "Registering user failed!" });
    }

    // const hashedPassword = await hashPassword(password);

    // await db.collection("users").insertOne({
    //   email,
    //   password: hashedPassword,
    // });

    client.close();
  }
}
export default handler;
