import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";      // <--- 1. Import Session
import { authOptions } from "@/utils/auth";          // <--- 2. Import Options (Check your path: lib/auth or utils/auth)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params; 
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  // 3. Get the session to find the token
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  // 4. Fetch with Authorization header
  const res = await fetch(`${BACKEND_URL}/movies/${id}`, {
    headers: {
      "Content-Type": "application/json",
      // If token exists, attach it. If not, Python sees an anonymous user.
      ...(token && { "Authorization": `Bearer ${token}` }),
    }
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to fetch" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}