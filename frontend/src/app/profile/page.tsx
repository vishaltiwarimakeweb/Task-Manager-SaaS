"use client";

import {
  Camera,
  Mail,
  CalendarDays,
  User,
  ShieldCheck,
  Pencil,
} from "lucide-react";
import { useAppSelector } from "../redux/hooks";
import ButtonLoader from "../components/ButtonLoader";
import { dateFormatter } from "../utils/dateFormatter";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import type { User as UserType } from "../types/types";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Account
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Profile
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Profile Summary */}
          <section className="h-fit rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative">
                  <a
                    href={
                      user?.avatar
                        ? user.avatar
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8c3Sme0e4y_h5kOcuahoak6p4xVDLvegwHbAiri5NTL6cPQ3YytRXDko&s=10"
                    }
                    target="_blank"
                  >
                    <img
                      src={
                        user?.avatar ??
                        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80`
                      }
                      alt="Profile picture"
                      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm dark:border-slate-800"
                    />
                  </a>

                  <button
                    type="button"
                    aria-label="Change profile picture"
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {user?.name ?? (
                    <>
                      <ButtonLoader buttonMessage="Loading name..." />
                    </>
                  )}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {user?.email ?? (
                    <ButtonLoader buttonMessage="Loading email..." />
                  )}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Member since
                    </p>
                    <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-300">
                      {user?.createdAt ? (
                        dateFormatter(user?.createdAt as string)
                      ) : (
                        <ButtonLoader buttonMessage="Loading date..." />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Personal Information */}
            <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Personal information
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                    Your basic account information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenProfileModal(!openProfileModal)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                {openProfileModal && (
                  <EditProfileModal
                    user={user as UserType}
                    openProfileModal
                    setOpenProfileModal={setOpenProfileModal}
                  />
                )}
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-500">
                    Full name
                  </label>

                  <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 dark:border-slate-800 dark:bg-slate-950">
                    <User className="h-4 w-4 text-slate-400" />

                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {user?.name ?? (
                        <ButtonLoader buttonMessage="Loading name..." />
                      )}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-500">
                    Email address
                  </label>

                  <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 dark:border-slate-800 dark:bg-slate-950">
                    <Mail className="h-4 w-4 text-slate-400" />

                    <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                      {user?.email ?? (
                        <ButtonLoader buttonMessage="Loading email..." />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Security */}
            <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      Account security
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      Keep your account secure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Password
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      Last updated recently
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/update-password")}
                    className="w-fit rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Change password
                  </button>
                </div>

                <div className="flex items-center justify-between px-6 py-5">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Account status
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      Your account is currently active.
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Active
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
