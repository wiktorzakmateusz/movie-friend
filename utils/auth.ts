// NextAuth.js configuration file

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({ // custom authentication system
      name: "Credentials",
      credentials: { // expected inputs
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) { // SignIn() configuration
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, { // backend call
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" }
          });

          const data = await res.json();

          if (res.ok && data.access_token) { // return User & token
            return {
              id: credentials?.email || "1", 
              email: credentials?.email,
              name: credentials?.email, 
              accessToken: data.access_token 
            };
          }
          return null;
        } catch (e) { // failure
          console.error(e);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) { // token cookie
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: any) { // token retrival for authenticated requests
      session.user.accessToken = token.accessToken;
      return session;
    }
  },
  session: { strategy: "jwt" }, // cookies
  secret: process.env.NEXTAUTH_SECRET, // cryptographic string to encrypt JWT cookie
};