import { connectDatabase } from "@/helpers/db-util";

async function handler(req, res) {
  // if (req.method !== "POST ") {
  //   return;
  // }

  if (req.method === "POST") {
    const data = req.body;
    const { username, birthdate } = data;

    if (!username || !birthdate) {
      res.status(422).json({
        message:
          "Invalid input - password should also be at least 7 characters long.",
      });
      return;
    }

    const client = await connectDatabase();
    const db = client.db(process.env.MONGODB_NAME);

    // 중복 아이디 계정 방지 로직
    const existingUser = await db
      .collection("users")
      .findOne({ username: username });

    if (existingUser) {
      res.status(422).json({ message: "User exists already!" });
      client.close();
      return;
    }

    // ✅ 특정 이메일은 관리자 계정으로 자동 등록
    const isAdmin = email === "admin@urang.com"; // ← 원하는 이메일 주소 넣기

    await db.collection("users").insertOne({
      username,
      role: isAdmin ? "admin" : "user",
    });

    // const hashedPassword = await hashPassword(password);

    // await db.collection("users").insertOne({
    //   email,
    //   password: hashedPassword,
    // });

    res.status(201).json({ message: "Created User!" });
    client.close();
  }
}
export default handler;
