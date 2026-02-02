import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";     // <--- 1. Import this
import { authOptions } from "@/utils/auth";         // <--- 2. Import your options

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 3. Get the session to find the token
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  // 4. Send the token to Python
  const res = await fetch(`${BACKEND_URL}/ratings/${id}`, { 
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }), // <--- Vital!
    } 
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to delete" }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}