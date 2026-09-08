"use client";
import Link from "next/link";
import { User, Mail, Lock, Camera, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { RegisterForm } from "../types/types";
import { imageUploadService } from "../utils/uploadImageService";
import { registerUser } from "../redux/slices/authSlice";
import ButtonLoader from "../components/ButtonLoader";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    name: "",
    password: "",
    avatar: "",
  });
  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [file, setFile] = useState<File | Blob | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const registerUserFunc = async () => {
    try {
      setBtnLoading(true);
      const result = await dispatch(registerUser(form));
      if (registerUser.fulfilled.match(result)) {
        if (result.payload.success) {
          successEmitter(result.payload.message, toasterTheme);
          router.push("/login");
        } else errorEmitter(result.payload.message, toasterTheme);
      } else if (registerUser.rejected.match(result))
        errorEmitter(String(result), toasterTheme);
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
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Get started with TaskWeb today.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await registerUserFunc();
            }}
            className="space-y-5"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Full name
              </label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  id="name"
                  name="name"
                  value={form.name}
                  required
                  onChange={onChangeFunc}
                  type="text"
                  placeholder="Enter your name"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div>
              <label
                htmlFor="profile-photo"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Profile photo
              </label>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500">
                  {!file ? (
                    <Camera className="h-5 w-5" />
                  ) : (
                    <div className="overflow-hidden rounded-full">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="profile-preview"
                        className="object-cover"
                        height={80}
                        width={80}
                      />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="profile-photo"
                  className="flex h-11 cursor-pointer items-center rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Choose photo
                </label>

                <input
                  id="profile-photo"
                  name="profilePhoto"
                  onChange={async (e) => {
                    if (e.target.files) {
                      const imageURL = await imageUploadService(
                        e.target.files[0],
                      );
                      setFile(imageURL ? e.target.files[0] : null);
                      setForm({ ...form, avatar: imageURL ? imageURL : "" });
                    }
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                PNG, JPG or WebP. Maximum 5MB.
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  id="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={onChangeFunc}
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Password */}

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Password
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onChangeFunc}
                placeholder="Create a password"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={btnLoading}
              className="h-11 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              {btnLoading ? (
                <>
                  <ButtonLoader buttonMessage="Creating Account..." />
                </>
              ) : (
                "Create account"
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

          {/* OAuth */}
          {/* <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
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
                d="M6.51 14.08A5.86 5.86 0 0 1 6.2 12c0-.72.12-1.42.31-2.08V7.39H3.26A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.01 4.61l3.25-2.53Z"
              />
              <path
                fill="currentColor"
                d="M12 5.89c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 2.97 14.63 2 12 2a9.75 9.75 0 0 0-8.74 5.39l3.25 2.53C7.29 7.61 9.45 5.89 12 5.89Z"
              />
            </svg>
            Continue with Google
          </button> */}
        </div>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
