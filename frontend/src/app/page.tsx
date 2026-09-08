import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Organize your work",
    description:
      "Keep every task in one place with clear statuses, priorities, and deadlines.",
  },
  {
    number: "02",
    title: "Stay focused",
    description:
      "See what needs your attention and keep your most important work moving forward.",
  },
  {
    number: "03",
    title: "Track progress",
    description:
      "Get a simple overview of completed, active, and overdue tasks without unnecessary complexity.",
  },
];

const previewTasks = [
  {
    title: "Design dashboard",
    status: "Completed",
    priority: "High",
  },
  {
    title: "Implement authentication",
    status: "In Progress",
    priority: "High",
  },
  {
    title: "Set up Redis",
    status: "Pending",
    priority: "Medium",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <main>
        {/* Hero */}
        <section className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
                Simple task management for focused work
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Get your work organized.
                <span className="block text-indigo-600 dark:text-indigo-400">
                  Get things done.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                TaskWeb helps you organize tasks, prioritize what matters, and
                keep track of your progress without getting in your way.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                >
                  Get started
                </Link>

                <Link
                  href="/login"
                  className="rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Product Preview */}
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                {/* Preview Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      My Tasks
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Stay on top of your work
                    </p>
                  </div>

                  <div className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">
                    + New Task
                  </div>
                </div>

                {/* Preview Stats */}
                <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 dark:divide-slate-800 dark:border-slate-800 sm:grid-cols-4">
                  {[
                    ["24", "Total tasks"],
                    ["8", "In progress"],
                    ["12", "Completed"],
                    ["4", "Overdue"],
                  ].map(([value, label]) => (
                    <div key={label} className="px-4 py-5 sm:px-6">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {value}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Preview Tasks */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {previewTasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Priority: {task.priority}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : task.status === "In Progress"
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Everything you need
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Built to keep work simple.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                TaskWeb gives you the essential tools to manage your work
                without adding unnecessary complexity.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
                >
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {feature.number}
                  </span>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="bg-slate-50 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                A simpler workflow
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                From idea to done.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                Create tasks, organize your priorities, and keep moving forward.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                [
                  "Create",
                  "Add a task with everything you need to get started.",
                ],
                ["Organize", "Set priorities, statuses, and deadlines."],
                ["Complete", "Track progress and mark work as you finish it."],
              ].map(([title, description], index) => (
                <div key={title} className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Ready to get organized?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
              Start managing your tasks with a workspace designed to keep things
              clear and focused.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            TaskWeb
          </div>

          <p>© 2026 TaskWeb. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
