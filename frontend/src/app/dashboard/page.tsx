"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { baseURL } from "../utils/baseURL";
import { MultipleTasksResponse, Task } from "../types/types";
import {
  setAllApiTasks,
  setAllApiUpcomingTasks,
} from "../redux/slices/taskSlice";
import { errorEmitter, successEmitter } from "../utils/emitter";
import { useEffect, useMemo, useState } from "react";
import {
  selectCompletedTasks,
  selectPendingTasks,
  selectProgressTasks,
  selectUpcomingTasks,
} from "../redux/selectors/task.selectore";
import TaskCard from "../components/TaskCard";
import UpcomingTaskCard from "../components/UpcomingTaskCard";
import Loader from "../components/Loader";
import ButtonLoader from "../components/ButtonLoader";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const months = [
  "January",
  "Februeary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "September",
  "October",
  "November",
  "December",
];

export default function DashboardPage() {
  const dateObj = new Date();
  const user = useAppSelector((state) => state.auth.user);
  const toasterTheme = useAppSelector((state) => state.theme.toastTheme);
  const allTasks = useAppSelector((state) => state.task.tasks);

  const pendingTasks = useAppSelector(selectPendingTasks);
  const completedTasks = useAppSelector(selectCompletedTasks);
  const workingTasks = useAppSelector(selectProgressTasks);
  const upcomingTasks = useAppSelector((state) => state.task.upcomingTasks);
  const [showAllTasks, setShowAllTasks] = useState<Task[]>(allTasks);
  const [showUpTasks, setShowUpTasks] = useState<Task[]>(upcomingTasks);
  /*
   * Pagination state
   */
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [upPage, setUpPage] = useState<number>(1);
  const [upLimit, setUpLimit] = useState<number>(3);

  /*
   * Pagination totals coming from Redux/API response.
   *
   * If your taskSlice uses different names for these,
   * only change these two selectors.
   */

  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [searchBtn, setSearchBtn] = useState<boolean>(false);
  const lastPage = useAppSelector((state) => state.task.lastPage);
  const upLastPage = useAppSelector((state) => state.task.upLastPage);

  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "working" | "completed"
  >("all");

  const getAllTasks = async () => {
    try {
      setPageLoading(true);
      const response = await fetch(
        `${baseURL}/api/task/alltasks/${page}/${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const taskData: MultipleTasksResponse = await response.json();

      //  console.log(taskData);

      if (taskData.success) {
        dispatch(setAllApiTasks(taskData));
        //successEmitter(taskData.message, toasterTheme);
        setShowAllTasks(taskData.allTasks);
      } else errorEmitter(taskData.message, toasterTheme);
      const upResponse = await fetch(
        `${baseURL}/api/task/allupcomingtasks/${upPage}/${upLimit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const taskResponse: MultipleTasksResponse = await upResponse.json();

      if (taskResponse.success) {
        //successEmitter(taskResponse.message, toasterTheme);
        dispatch(setAllApiUpcomingTasks(taskResponse));
        setShowUpTasks(taskResponse.allTasks);
      } else errorEmitter(taskResponse.message, toasterTheme);
    } catch (error) {
      console.error(error);
      errorEmitter(
        "Failed to fetch tasks, retrying in 2 seconds...",
        toasterTheme,
      );
      setTimeout(async () => {
        await getAllTasks();
      }, 2000);
    } finally {
      setPageLoading(false);
    }
  };

  const getAllFilterTasks = async () => {
    try {
      setPageLoading(true);
      const response = await fetch(
        `${baseURL}/api/task/allfiltertasks/${page}/${limit}/${statusFilter}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const taskData: MultipleTasksResponse = await response.json();

      //  console.log(taskData);

      if (taskData.success) {
        //successEmitter(taskData.message, toasterTheme);
        setShowAllTasks(taskData.allTasks);
      } else errorEmitter(taskData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const getAllUpcomingTasks = async () => {
    try {
      const upResponse = await fetch(
        `${baseURL}/api/task/allupcomingtasks/${upPage}/${upLimit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const taskResponse: MultipleTasksResponse = await upResponse.json();

      if (taskResponse.success) {
        // successEmitter(taskResponse.message, toasterTheme);
        dispatch(setAllApiUpcomingTasks(taskResponse));
        setShowUpTasks(taskResponse.allTasks);
      } else errorEmitter(taskResponse.message, toasterTheme);
    } catch (error) {
      console.error(error);
    }
  };

  const searchTasks = async () => {
    setSearchBtn(true);
    try {
      if (searchQuery.trim().length === 0) {
        errorEmitter("Keyword can't be empty", toasterTheme);
        return;
      }
      const response = await fetch(
        `${baseURL}/api/task/searchtask?keyword=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const searchData: MultipleTasksResponse = await response.json();
      if (searchData.success) {
        setShowAllTasks(searchData.allTasks);
      } else errorEmitter(searchData.message, toasterTheme);
    } catch (error) {
      console.error(error);
    } finally {
      setSearchBtn(false);
    }
  };

  const stats = [
    {
      label: "Total tasks",
      value: allTasks.length,
      description: "Across all statuses",
      icon: ListTodo,
    },
    {
      label: "In progress",
      value: workingTasks.length,
      description: "Currently working on",
      icon: Clock3,
    },
    {
      label: "Completed",
      value: completedTasks.length,
      description: "Finished this month",
      icon: CheckCircle2,
    },
    {
      label: "Overdue",
      value: pendingTasks.length,
      description: "Need your attention",
      icon: CalendarDays,
    },
  ];

  /*
   * Initial fetch
   */

  /*
   * Fetch all-task page whenever page changes
   */
  useEffect(() => {
    const fetchTasks = async () => {
      await getAllTasks();
    };
    const fetchFilterTasks = async () => {
      await getAllFilterTasks();
    };
    statusFilter === "all"
      ? allTasks.length === 0 && fetchTasks()
      : fetchFilterTasks();
  }, [page, statusFilter]);

  /*
   * Fetch upcoming-task page whenever upPage changes
   */
  useEffect(() => {
    const fetchUpTasks = async () => {
      await getAllUpcomingTasks();
    };
    fetchUpTasks();
  }, [upPage]);

  useEffect(() => {
    const reset = () => {
      if (statusFilter === "all") {
        setShowAllTasks(allTasks);
      }
      if (searchQuery.trim().length === 0) {
        setShowAllTasks(allTasks);
      }
    };
    reset();
  }, [statusFilter, searchQuery]);

  const progressPercent = useMemo(() => {
    // console.log(
    //   "Progress : ",
    //   Math.ceil(
    //     (completedTasks.length / (allTasks.length > 0 ? allTasks.length : 1)) *
    //       100,
    //   ),
    //   " because completed = ",
    //   completedTasks.length,
    //   " and alltasks = ",
    //   allTasks.length,
    //   " and result = ",
    //   completedTasks.length / allTasks.length,
    // );
    return Math.ceil(
      (completedTasks.length / (allTasks.length > 0 ? allTasks.length : 1)) *
        100,
    );
  }, [allTasks, completedTasks]);

  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950 dark:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                    T
                  </span>
                  TaskWeb
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-6">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Workspace
                </p>
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Overview
                  </Link>

                  <Link
                    href="/create-task"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <ListTodo className="h-4 w-4" />
                    Create new Task
                  </Link>
                </div>

                <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Account
                </p>

                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>

                  {/* <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link> */}
                </div>
              </nav>

              {/* User */}
              <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {user?.name.slice(0, 1)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.name}
                    </p>

                    <p className="truncate text-xs text-slate-500 dark:text-slate-500">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Logout"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="min-w-0 flex-1">
              {/* Mobile Header */}
              <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:hidden">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold text-slate-950 dark:text-white"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                      TW
                    </span>
                    TaskWeb
                  </Link>

                  <button
                    type="button"
                    aria-label="Open menu"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </header>

              {/* Content */}
              <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Dashboard Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {
                        weekDays[
                          dateObj.getDay() !== 0 ? dateObj.getDay() - 1 : 6
                        ]
                      }
                      , {months[dateObj.getMonth() - 1]} {dateObj.getDate()}
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                      Good{" "}
                      {dateObj.getHours() >= 16
                        ? "Evening"
                        : dateObj.getHours() >= 12
                          ? "Afternoon"
                          : "Morning"}
                      , {user?.name}
                    </h1>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Here&apos;s what&apos;s happening with your tasks today.
                    </p>
                  </div>

                  <Link
                    href="/create-task"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                  >
                    <Plus className="h-4 w-4" />
                    New task
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <Icon className="h-4 w-4" />
                          </div>

                          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            This month
                          </span>
                        </div>

                        <p className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">
                          {stat.value}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {stat.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                          {stat.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Main Grid */}
                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                  {/* All Tasks */}
                  <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                            All tasks
                          </h2>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                            Your latest work
                          </p>
                        </div>

                        {/* Search */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 z-20 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search tasks..."
                              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={searchBtn}
                            onClick={async () => await searchTasks()}
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                          >
                            <Search className="h-4 w-4" />
                            {searchBtn ? (
                              <ButtonLoader buttonMessage="Searching..." />
                            ) : (
                              "Search"
                            )}
                          </button>
                        </div>

                        {/* Status filters */}
                        <div className="flex w-full items-center gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                          {[
                            {
                              key: "all",
                              label: "All",
                              count: allTasks.length,
                            },
                            {
                              key: "pending",
                              label: "Pending",
                              count: pendingTasks.length,
                            },
                            {
                              key: "working",
                              label: "Working",
                              count: workingTasks.length,
                            },
                            {
                              key: "completed",
                              label: "Completed",
                              count: completedTasks.length,
                            },
                          ].map((filter) => {
                            const active = statusFilter === filter.key;

                            return (
                              <button
                                key={filter.key}
                                type="button"
                                onClick={() =>
                                  setStatusFilter(
                                    filter.key as
                                      | "all"
                                      | "pending"
                                      | "working"
                                      | "completed",
                                  )
                                }
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                  active
                                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                              >
                                {filter.label}

                                {filter.key === statusFilter && (
                                  <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                      active
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                                        : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                    }`}
                                  >
                                    {allTasks.length}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {showAllTasks.map((task) => (
                        <TaskCard
                          page={page}
                          upPage={upPage}
                          key={task._id}
                          task={task}
                        />
                      ))}
                    </div>

                    {/* All Tasks Pagination */}
                    <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Showing page{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {lastPage > 0 ? lastPage : 1}
                        </span>
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={page <= 1}
                          onClick={() => setPage((prev) => prev - 1)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Previous
                        </button>

                        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-indigo-600 px-2 text-xs font-semibold text-white">
                          {page}
                        </span>

                        <button
                          type="button"
                          disabled={page >= lastPage}
                          onClick={() => setPage((prev) => prev + 1)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          Next
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Progress */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                            Your progress
                          </h2>

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                            Overall tasks completion
                          </p>
                        </div>

                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {progressPercent}%
                        </span>
                      </div>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          style={{
                            width: `${progressPercent}%`,
                          }}
                          className={`h-full w-0 rounded-full bg-green-600`}
                        />
                      </div>

                      <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-500">
                        <span>{completedTasks.length} completed</span>
                        <span>{allTasks.length} total</span>
                      </div>
                    </section>

                    {/* Upcoming */}
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                          Upcoming
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                          Tasks due soon
                        </p>
                      </div>

                      <div className="space-y-1 p-3">
                        {showUpTasks.map((task) => (
                          <UpcomingTaskCard
                            key={task._id}
                            task={task}
                            page={page}
                            upPage={upPage}
                          />
                        ))}
                      </div>

                      {/* Upcoming Pagination */}
                      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                        <p className="text-[11px] text-slate-500 dark:text-slate-500">
                          Page{" "}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {upPage}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {upLastPage}
                          </span>
                        </p>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={upPage === 1}
                            onClick={() => setUpPage((prev) => prev - 1)}
                            aria-label="Previous upcoming tasks page"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </button>

                          <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-indigo-600 px-2 text-xs font-semibold text-white">
                            {upPage}
                          </span>

                          <button
                            type="button"
                            disabled={upPage >= upLastPage}
                            onClick={() => setUpPage((prev) => prev + 1)}
                            aria-label="Next upcoming tasks page"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
