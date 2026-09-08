"use client";
import {
  ArrowLeft,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../redux/hooks";
import { useState } from "react";
import { ForgotPasswordForm, GeneralApiResponse } from "../types/types";
import { baseURL } from "../utils/baseURL";
import { errorEmitter, successEmitter } from "../utils/emitter";
import ButtonLoader from "../components/ButtonLoader";

function ForgotPassword() {
  const router = useRouter();
  const toastTheme = useAppSelector((state) => state.theme.toastTheme);
  const [otpBtn, setOtpBtn] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [form, setForm] = useState<ForgotPasswordForm>({
    otpEntered: 0,
    email: "",
    newPassword: "",
  });
  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [showPass, setShowPass] = useState<boolean>(false);
  const sendOTP = async () => {
    try {
      setOtpBtn(true);
      const response = await fetch(`${baseURL}/api/auth/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
        }),
      });
      const otpData: GeneralApiResponse = await response.json();
      if (otpData.success) {
        successEmitter(otpData.message, toastTheme);
      } else errorEmitter(otpData.message, toastTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setOtpBtn(false);
    }
  };

  const changePassword = async () => {
    try {
      setBtnLoading(true);
      const response = await fetch(`${baseURL}/api/auth/forgotpassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const changeData: GeneralApiResponse = await response.json();
      if (changeData.success) {
        successEmitter(changeData.message, toastTheme);
        router.push("/login");
      } else errorEmitter(changeData.message, toastTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl items-center justify-center">
        <div className="w-full">
          {/* Back to login */}
          <button
            type="button"
            disabled={btnLoading || otpBtn}
            onClick={() => router.push("/login")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Reset your password
            </h1>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Verify your account with an OTP and create a new password.
            </p>
          </div>

          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await changePassword();
              }}
            >
              <div className="space-y-6 p-6 sm:p-7">
                {/* Registered email */}
                <div>
                  <label
                    htmlFor="registered-email"
                    className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
                  >
                    Registered email
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="registered-email"
                      name="email"
                      required
                      value={form.email}
                      onChange={onChangeFunc}
                      type="email"
                      placeholder="Enter your registered email"
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>

                  <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                    We&apos;ll send a password reset OTP to this email address.
                  </p>
                </div>

                {/* OTP */}
                <div>
                  <label
                    htmlFor="reset-otp"
                    className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200"
                  >
                    Verification OTP
                  </label>

                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="reset-otp"
                        type="number"
                        required
                        name="otpEntered"
                        value={form.otpEntered}
                        onChange={onChangeFunc}
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm tracking-[0.2em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={btnLoading || otpBtn}
                      onClick={async () => await sendOTP()}
                      className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    >
                      {otpBtn ? (
                        <ButtonLoader buttonMessage="Sending OTP..." />
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      OTP is valid for a limited time.
                    </p>
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
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="new-password"
                      required
                      type={showPass ? "text" : "password"}
                      name="newPassword"
                      value={form.newPassword}
                      onChange={onChangeFunc}
                      placeholder="Enter your new password"
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-label="Show new password"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPass ? (
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
                      Password reset
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-indigo-700/80 dark:text-indigo-400/80">
                      Enter the OTP sent to your registered email before setting
                      your new password.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
                <button
                  type="button"
                  disabled={btnLoading || otpBtn}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </button>

                <button
                  type="submit"
                  disabled={btnLoading || otpBtn}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  {btnLoading ? (
                    <ButtonLoader buttonMessage="Updating password..." />
                  ) : (
                    "Update password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
