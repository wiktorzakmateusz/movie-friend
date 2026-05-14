// router to register a user

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, email, password } = body;

    const API_URL = process.env.NEXT_PUBLIC_API_URL; 
    
    // sending the data to backend
    const response = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, password }),
    });

    // returning failure
    if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
            { message: errorData.detail || "Registration failed" }, 
            { status: response.status }
        );
    }

    const data = await response.json();
    
    // returning succes
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}