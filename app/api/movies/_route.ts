// router that fetches movies - reduntant?

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/utils/auth"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request: Request) {
  try {
    // getting token
    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken;

    // search parameters
    const { searchParams } = new URL(request.url);
    const backendUrl = new URL(`${API_URL}/movies/`);
    searchParams.forEach((value, key) => backendUrl.searchParams.append(key, value));

    // fetching data from backend
    const res = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }), 
      },
      cache: "no-store"
    });

    if (res.status === 401) { // user isn't logged in
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