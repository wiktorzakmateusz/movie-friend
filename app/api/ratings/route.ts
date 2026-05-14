// router to fetch / update user ratings

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function getAuthHeaders() {

  // getting token
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
}

// fetching all ratings
export async function GET() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${BACKEND_URL}/ratings/`, {
    cache: 'no-store',
    headers: headers,
  });

  if (res.status === 401) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

// adding / updating a rating
export async function POST(request: Request) {
  const body = await request.json();
  const headers = await getAuthHeaders();

  const res = await fetch(`${BACKEND_URL}/ratings/`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Backend error" }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
