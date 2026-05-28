// router that fetches user similar movies prediction

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";      
import { authOptions } from "@/utils/auth";        

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params; 
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  // getting token
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  // fetching data from backend
  const res = await fetch(`${BACKEND_URL}/recommendations/${id}/similar_movies`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    }
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json({ error: "Similar movies not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to fetch similar movies" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}