"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setTheme, toggleTheme } from "../redux/slices/themeSlice";
import { useEffect, useState } from "react";
import { logOutUser, setUser } from "../redux/slices/authSlice";
import Image from "next/image";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";
import ButtonLoader from "./ButtonLoader";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isLogin = useAppSelector((state) => state.auth.isLogin);
  const user = useAppSelector((state) => state.auth.user);
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const storedUser = localStorage ? localStorage.getItem("currUser") : null;
    if (storedTheme === "dark" || storedTheme === "light")
      dispatch(setTheme(storedTheme as "light" | "dark"));
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser) dispatch(setUser(parsedUser));
    }
  }, [dispatch]);
  const logOutFunc = async () => {
    try {
      setBtnLoading(true);
      const logData = await dispatch(logOutUser());
      if (logData.payload.success) {
        //successEmitter(logData.payload.message, toasterTheme);
        router.push("/login");
      } else errorEmitter(logData.payload.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };
  // console.log("Redux user:", user);
  // console.log("Redux toaster theme : ", toasterTheme);
  // console.log("Redux isLogin:", isLogin);
  // console.log("Avatar:", user?.avatar);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              TW
            </span>

            <span>TaskWeb</span>
          </Link>

          <Link
            href="/dashboard"
            className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white sm:block"
          >
            Home
          </Link>
        </div>

        {/* Center Theme Switch */}
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => {
            dispatch(toggleTheme());
          }}
          className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </button>

        {/* Right */}
        <div className="flex items-center gap-3">
          {isLogin ? (
            <button
              onClick={logOutFunc}
              disabled={btnLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              {btnLoading ? (
                <ButtonLoader buttonMessage="Logging out..." />
              ) : (
                "Log Out"
              )}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              Login
            </Link>
          )}

          {isLogin && (
            <img
              onClick={() => router.push("/profile")}
              src={user?.avatar as string}
              alt="Profile picture"
              style={{
                cursor: "pointer",
              }}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          )}
        </div>
      </nav>
    </header>
  );
}
