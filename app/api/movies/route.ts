import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; 
// IMPORTANT: Update this import to where you actually moved authOptions
// Likely: "@/lib/auth" or "@/utils/auth" based on our previous steps
import { authOptions } from "@/utils/auth"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request: Request) {
  try {
    // 1. Get the session (Uncommented and active)
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    // 2. Prepare URL (Forward any query params like ?title=...)
    // This allows this same route to handle search if you call /api/movies?title=Matrix
    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(`${API_URL}/movies/`);
    searchParams.forEach((value, key) => backendUrl.searchParams.append(key, value));

    // 3. Fetch from Python with the Token
    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // The magic line: Pass the token to Python
        ...(token && { "Authorization": `Bearer ${token}` }), 
      },
      cache: "no-store"
    });

    if (res.status === 401) {
      // If Python says 401, it means the user isn't logged in (or token expired).
      // We return an empty list or an error depending on your UX preference.
      // Returning 401 lets the frontend decide (e.g., redirect to login).
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movies from backend" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}