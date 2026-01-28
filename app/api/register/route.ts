import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, email, password } = body;

    // 1. Send data to your Python Backend
    // Note: We don't need NEXT_PUBLIC_ here because this runs on the server
    const API_URL = process.env.NEXT_PUBLIC_API_URL; 
    
    const response = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
            { message: errorData.detail || "Registration failed" }, 
            { status: response.status }
        );
    }

    const data = await response.json();
    
    // 2. Return success to the frontend
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}