import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";     // <--- 1. Import Session
import { authOptions } from "@/utils/auth";         // <--- 2. Import Options

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  try {
    // 3. Get the token server-side
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    // 4. Forward the request to FastAPI with the token
    const res = await fetch(`${BACKEND_URL}/movies/search?${searchParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        // 5. Attach the token if it exists
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    });

    // Check for 401 specifically
    if (res.status === 401) {
       // If the user isn't logged in, search might not be allowed on the backend anymore.
       // You can return an empty list or an error, depending on your preference.
       return NextResponse.json({ error: "Please log in to search" }, { status: 401 });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from backend" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}