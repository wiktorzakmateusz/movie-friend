import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define auth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Send credentials to your Python Backend
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" }
          });

          const data = await res.json();

          // 2. If backend returns an access_token, we consider it a success
          if (res.ok && data.access_token) {
            // Return an object that represents the user. 
            // We'll store the token in the session later.
            return { 
              id: credentials?.email || "1", 
              email: credentials?.email,
              name: credentials?.email, // Using email as name for now
              accessToken: data.access_token 
            };
          }
          return null; // Login failed
        } catch (e) {
          console.error(e);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // 3. Add the backend token to the NextAuth JWT
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // 4. Make the token available to the client (Navbar, etc.)
    async session({ session, token }: any) {
      session.user.accessToken = token.accessToken;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // You'll need to add this to .env
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };