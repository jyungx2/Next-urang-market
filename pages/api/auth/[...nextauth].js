import { connectDatabase } from "@/helpers/db-util";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialProvider({
      id: "credentials",
      async authorize(credentials) {
        const client = await connectDatabase();
        const usersCollection = client
          .db(process.env.MONGODB_NAME)
          .collection("users");

        const user = await usersCollection.findOne({
          username: credentials.username,
          birthdate: credentials.birthdate,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!");
        }

        return {
          id: user._id.toString(),
          username: user.username,
          birthdate: user.birthdate.toString(),
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.birthdate = user.birthdate;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.birthdate = token.birthdate;
      session.user.role = token.role;
      return session;
    },
  },
});
