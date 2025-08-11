import { connectDatabase } from "@/helpers/db-util";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialProvider({
      id: "phoneLogin",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        code: { label: "Code", type: "text" },

        // 임시 로그인용 정보
        username: { label: "name of user", type: "text" },
        birthdate: { label: "Birthdate", type: "text" },
      },
      async authorize(credentials) {
        console.log("🔥 credentials:", credentials);

        const client = await connectDatabase();
        const usersCollection = client
          .db(process.env.MONGODB_NAME)
          .collection("users");

        // 1️⃣ 자동 로그인 (회원가입 직후): code 없이 요청 들어옴
        if (credentials.phoneNumber && !credentials.code) {
          // ✨ credentials는 로그인 시 사용자가 입력한 값 => 인증되지 않은 정보가 session에 들어갈 수 있는 위험⭕️ & 사용자가 악의적으로 다른 nickname을 넣었을 때도 session에 저장될 수 있는 문제🚫 => credentials를 이용해 DB에서 유저를 찾는 용도로만 씀!
          // ✨ user는 그걸 바탕으로 DB에서 찾은 실제 유저 정보 => 검증된 안전한 정보✅
          const user = await usersCollection.findOne({
            username: credentials.username,
            phoneNumber: credentials.phoneNumber,
          });

          if (!user) throw new Error("No user found for auto-login");

          return {
            id: user._id.toString(), // DB에서 가져온 값
            location: user.location, // DB에서 가져온 값
            username: user.username, // DB에서 가져온 값
            birthdate: user.birthdate, // DB에서 가져온 값
            phoneNumber: user.phoneNumber, // DB에서 가져온 값
            nickname: user.nickname, // DB에서 가져온 값
            profileImage: user.profileImage, // DB에서 가져온 값
            recentLocations: user.recentLocations ?? [], // ⚠️꼭 추가!
            selectedLocation: user.selectedLocation,
            likes: user.likes ?? [],
            dislikes: user.dislikes ?? [],
            searchHistory: user.searchHistory ?? [],
          }; // ✅ 로그인 성공 => 유저입력값인 crendentials가 아니라 실제로 유효성이 검증된 DB에 존재하는 값들을 리턴해야 함!
        }

        // 2️⃣ 일반 로그인 (로그인 폼에서 인증번호 입력)
        // const storedCode = await redis.get(credentials.phoneNumber);
        // if (!storedCode || storedCode !== credentials.code) {
        //   throw new Error("인증번호가 일치하지 않거나 만료되었습니다.");
        // }

        if (credentials.username && credentials.birthdate) {
          const user = await usersCollection.findOne({
            // phoneNumber: credentials.phoneNumber,

            // 임시 로그인용
            username: credentials.username,
            birthdate: credentials.birthdate,
          });
          if (!user)
            throw new Error(
              "입력하신 정보로 가입된 사용자를 찾을 수 없습니다."
            );

          // await redis.del(credentials.phoneNumber); // 인증번호 제거

          return {
            id: user._id.toString(), // DB에서 가져온 값
            location: user.location, // DB에서 가져온 값
            username: user.username, // DB에서 가져온 값
            birthdate: user.birthdate, // DB에서 가져온 값
            phoneNumber: user.phoneNumber, // DB에서 가져온 값
            nickname: user.nickname, // DB에서 가져온 값
            profileImage: user.profileImage, // DB에서 가져온 값
            recentLocations: user.recentLocations,
            selectedLocation: user.selectedLocation,
            likes: user.likes ?? [],
            dislikes: user.dislikes ?? [],
            searchHistory: user.searchHistory ?? [],
          }; // ✅ 로그인 성공
        }
      },
    }),
  ],
  // ** 콜백: “로그인 과정 중간에 개입해서 정보를 추가하거나 수정할 수 있게 해주는 함수들”
  // 1️⃣ authorize()에 의해 로그인로직(signIn()) 성공 시, 리턴되는 유저 정보를 jwt() 콜백의 토큰에 넣어서 jwt토큰 생성. => 이 토큰은 서버/클라이언트 모두에서 인증상태를 유지하는데 사용가능. => 이걸 해줘야만 세션에 해당 속성값이 들어갈 수 있음
  // next-auth에서 getSession()은 session 콜백을 통해 클라이언트에 session.user를 구성, 그런데 session 콜백은 결국 jwt 콜백에서 token에 담아둔 값만을 바탕으로 session을 구성.. 즉, jwt → session → client 순서로 이어지기 때문에 여기서 currentUser(전역상태값)에 저장할 속성을 누락하면 undefined 오류가 뜸.
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.location = user.location;
        token.username = user.username;
        token.birthdate = user.birthdate;
        token.phoneNumber = user.phoneNumber;
        token.nickname = user.nickname;
        token.profileImage = user.profileImage;
        token.role = user.role;
        token.recentLocations = user.recentLocations ?? [];
        token.selectedLocation = user.selectedLocation;
        token.likes = user.likes;
        token.dislikes = user.dislikes;
        token.searchHistory = user.searchHistory;
      }
      return token;
    },
    // 2️⃣ 클라이언트에서 getSession()을 호출하면 이 콜백이 실행되고, 위에서 만든 token 정보를 바탕으로 세션을 구성함
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.location = token.location;
      session.user.username = token.username;
      session.user.birthdate = token.birthdate;
      session.user.phoneNumber = token.phoneNumber;
      session.user.nickname = token.nickname;
      session.user.profileImage = token.profileImage;
      session.user.role = token.role;
      session.user.recentLocations = token.recentLocations ?? []; // null or undefined일 경우에만 []을 넣겠다..
      session.user.selectedLocation = token.selectedLocation;
      session.user.likes = token.likes;
      session.user.dislikes = token.dislikes;
      session.user.searchHistory = token.searchHistory;

      return session;
    },
  },
});

// 위치	역할	비고
// 1. jwt(): DB에서 가져온 user 데이터를 token에 저장/이때 빠지면 session()에서도 사라짐
// 2. session(): token 데이터를 session.user에 복사/여기서 사용하는 건 token 값임
// 3. getSession():	최종적으로 session.user를 클라이언트에서 사용/즉, user.recentLocations이 여기까지 도달하려면 처음부터 다 넣어야 함
