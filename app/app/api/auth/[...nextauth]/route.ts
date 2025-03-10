import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";

const authOptions = {
  secret: "FEEDBACK1234ABCD",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
    verifyRequest: "/verify-request",
    newUser: "/new-user",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
