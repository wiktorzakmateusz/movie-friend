import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth"; // Ensure path matches your project

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Helper to get headers with Token
async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
}

// 1. GET: Fetch all ratings
export async function GET() {
  const headers = await getAuthHeaders(); // Reuse the helper

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

// 2. POST: Add/Update a rating (Restored & Secured!)
export async function POST(request: Request) {
  const body = await request.json();
  const headers = await getAuthHeaders(); // Reuse the helper

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
