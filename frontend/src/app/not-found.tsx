"use client";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <SearchX className="h-6 w-6" />
        </div>

        {/* 404 */}
        <p className="text-7xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-8xl">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
          Page not found
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Actions */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go to Home Page
          </button>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
          If you believe this is a mistake, try refreshing the page.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
