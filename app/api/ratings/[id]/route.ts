// router to delete a user rating

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // getting token
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  // deleting data in backend
  const res = await fetch(`${BACKEND_URL}/ratings/${id}`, { 
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    } 
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to delete" }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}