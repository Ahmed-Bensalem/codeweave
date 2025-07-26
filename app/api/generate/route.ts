import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;
    const token = await authData.getToken();

    const body = await req.json();

    const backendRes = await fetch(
      "https://codeweave-backend.onrender.com/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();

    return new NextResponse(JSON.stringify(data), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ API error:", err);
    return new NextResponse(JSON.stringify({ detail: "Server error" }), {
      status: 500,
    });
  }
}
