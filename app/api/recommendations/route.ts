// router that fetches movie recommendations for the user

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/utils/auth"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request: Request) {
  try {
    // getting token
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    // fetching data from backend
    const res = await fetch(`${API_URL}/recommendations/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }), 
      },
      cache: "no-store"
    });

    if (res.status === 401) {
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