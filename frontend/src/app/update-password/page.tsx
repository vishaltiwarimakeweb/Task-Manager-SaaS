"use client";
import {
  ArrowLeft,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GeneralApiResponse, PasswordForm } from "../types/types";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useAppSelector } from "../redux/hooks";
import ButtonLoader from "../components/ButtonLoader";

function ChangePassword() {
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showOldPass, setShowOldPass] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const router = useRouter();
  const toastTheme = useAppSelector((state) => state.theme.toastTheme);
  const [form, setForm] = useState<PasswordForm>({
    currPassword: "",
    newPassword: "",
  });
  const updatePassword = async () => {
    try {
      setBtnLoading(true);
      const response = await fetch(`${baseURL}/api/auth/updatepassword`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const passData: GeneralApiResponse = await response.json();
      if (passData.success) {
        successEmitter(passData.message, toastTheme);
        router.push("/profile");
      } else errorEmitter(passData.message, toastTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <KeyRound className="h-5 w-5" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Change password
          </h1>

          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Update your password to keep your account secure.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await updatePassword();
            }}
          >
            <div className="space-y-6 p-6 sm:p-7">
              {/* Current password */}
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  Current password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="current-password"
                    required
                    value={form.currPassword}
                    onChange={(e) =>
                      setForm({ ...form, currPassword: e.target.value })
                    }
                    type={showOldPass ? "text" : "password"}
                    placeholder="Enter your current password"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    aria-label="Show current password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showOldPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800" />

              {/* New password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  New password
                </label>

                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="new-password"
                    required
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    type={showNewPass ? `text` : `password`}
                    placeholder="Enter your new password"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    aria-label="Show new password"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password requirements */}
                <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-950">
                  <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Strong passwords contain :
                  </p>

                  <div className="grid gap-1.5 text-[11px] text-slate-400 sm:grid-cols-2 dark:text-slate-500">
                    <span>• At least 8 characters</span>
                    <span>• One uppercase letter</span>
                    <span>• One lowercase letter</span>
                    <span>• One number or special character</span>
                  </div>
                </div>
              </div>

              {/* Security notice */}
              <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-indigo-600 dark:text-indigo-400" />

                <div>
                  <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                    Keep your account secure
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-indigo-700/80 dark:text-indigo-400/80">
                    Never share your password with anyone. If you don&apos;t
                    remember your current password, use the OTP option below.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              {/* OTP */}
              <button
                type="button"
                onClick={() => router.push("/reset-password")}
                className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Reset by OTP
              </button>

              <div className="flex items-center justify-end gap-3">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  disabled={btnLoading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                {/* Update */}
                <button
                  type="submit"
                  disabled={btnLoading}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  {btnLoading ? (
                    <ButtonLoader buttonMessage="Updating password..." />
                  ) : (
                    "Update password"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
