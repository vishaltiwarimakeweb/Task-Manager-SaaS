import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "./app/utils/baseURL";
import { GeneralApiResponse } from "./app/types/types";

export async function proxy(req: NextRequest) {
  let isLogin: boolean = true;
  const token = req.cookies.get("token")?.value;

  try {
    const response = await fetch(`${baseURL}/api/auth/checklogin`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: token ? `token=${token}` : "",
      },
    });
    const checkData: GeneralApiResponse = await response.json();

    const { pathname } = req.nextUrl;
    if (!checkData.success) isLogin = false;
    if (
      checkData.success &&
      ((isLogin && pathname.includes("/login")) ||
        (isLogin && pathname.includes("/register")) ||
        (isLogin && pathname.includes("/forgot-password")))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (
      !checkData.success &&
      ((!isLogin && pathname.includes("/dashboard")) ||
        (!isLogin && pathname.includes("/profile")) ||
        (!isLogin && pathname.includes("/create-task")) ||
        (!isLogin && pathname.includes("/update-password")))
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Backend unavilable", error);
    return NextResponse.next();
  }
}
