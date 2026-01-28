import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Optional: if you need to pass the user's token
import { authOptions } from "../auth/[...nextauth]/route"; // Import your auth options

export async function GET() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    // 1. (Optional) Get the session if your backend requires authentication
    // const session = await getServerSession(authOptions);
    // const token = session?.user?.accessToken;

    // 2. Fetch data from Python Backend (Server to Server)
    const res = await fetch(`${API_URL}/movies/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // Uncomment if your backend needs the token
      },
      cache: "no-store" // Ensure we always get fresh data
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movies from backend" },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // 3. Return data to the Frontend
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}