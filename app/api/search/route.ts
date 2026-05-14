// router to search movies

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  try {
    // getting token
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    // fetching data from backend
    const res = await fetch(`${BACKEND_URL}/movies/search?${searchParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
    });

    if (res.status === 401) {
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