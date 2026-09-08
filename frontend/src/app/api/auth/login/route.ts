import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/app/utils/baseURL";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const nextResponse = NextResponse.json(data);

    nextResponse.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return nextResponse;
  } catch (error) {
    console.error("Next.js login error:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 },
    );
  }
}
