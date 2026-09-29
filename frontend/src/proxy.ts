import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "./app/utils/baseURL";
import { GeneralApiResponse } from "./app/types/types";

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  let isLogin: boolean = true;
  const token = req.cookies.get("token")?.value;
  console.log("Proxy token : ", token);
  if (!token) isLogin = false;

  const { pathname } = req.nextUrl;

  if (
    (isLogin && pathname.includes("/login")) ||
    (isLogin && pathname.includes("/register")) ||
    (isLogin && pathname.includes("/forgot-password"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (
    (!isLogin && pathname.includes("/dashboard")) ||
    (!isLogin && pathname.includes("/profile")) ||
    (!isLogin && pathname.includes("/create-task")) ||
    (!isLogin && pathname.includes("/update-password"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
