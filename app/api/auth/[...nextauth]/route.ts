// authentication router

import NextAuth from "next-auth"; 
import { authOptions } from "@/utils/auth"; // configurations details

const handler = NextAuth(authOptions); // custom authentication handler

export { handler as GET, handler as POST };