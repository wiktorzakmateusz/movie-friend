// router that updates rating ignore flag to True

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";      
import { authOptions } from "@/utils/auth";        

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params; 
  const body = await request.json();

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  // getting token
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;

  // updating data in backend
  const res = await fetch(`${BACKEND_URL}/ratings/${id}/ignore`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to update ignore status" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}