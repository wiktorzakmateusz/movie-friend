// session provider

"use client"; // client-side rendering

import { SessionProvider } from "next-auth/react";

// client-side boundary
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}