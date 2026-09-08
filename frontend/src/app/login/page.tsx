"use client";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { LoginForm } from "../types/types";
import { loginUser } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoader from "../components/ButtonLoader";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const loginFunc = async () => {
    try {
      setBtnLoading(true);
      const result = await dispatch(loginUser(form));
      //console.log(result);
      if (loginUser.fulfilled.match(result)) {
        if (result.payload.success) {
          successEmitter(result.payload.message, toasterTheme);
          router.push("/dashboard");
        } else errorEmitter(result.payload.message, toasterTheme);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
            TW
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to continue to TaskWeb.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await loginFunc();
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={onChangeFunc}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={onChangeFunc}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-800 dark:text-slate-500 dark:hover:text-blue-800"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 2-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={btnLoading}
              className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {btnLoading ? (
                <ButtonLoader buttonMessage="Signing in..." />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            <span className="text-xs text-slate-400 dark:text-slate-500">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div> */}

          {/* Google OAuth */}
          {/* <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-indigo-400 dark:focus:ring-offset-slate-900"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
              />
              <path
                fill="currentColor"
                d="M12 21.99c2.63 0 4.84-.87 6.46-2.36l-3.14-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.71-1.72-5.49-4.03H3.26v2.53A9.75 9.75 0 0 0 12 21.99Z"
              />
              <path
                fill="currentColor"
                d="M6.51 14.08A5.86 5.86 0 0 1 6.2 12c0-.72.12-1.42.31-2.08V7.39H3.26A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.61 4.61l3.25-2.53Z"
              />
              <path
                fill="currentColor"
                d="M12 5.89c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 2.97 14.63 2 12 2a9.75 9.75 0 0 0-8.74 5.39l3.25 2.53C7.29 7.61 9.45 5.89 12 5.89Z"
              />
            </svg>
            Continue with Google
          </button> */}
        </div>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
