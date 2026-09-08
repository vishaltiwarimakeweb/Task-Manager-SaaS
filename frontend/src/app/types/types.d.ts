export type Theme = {
  theme: "light" | "dark";
  toastTheme: "colored" | "dark";
};

export type User = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  createdAt: string;
};

export type ProfileEditForm = {
  name: string;
  avatar: string;
  email: string;
};

export type PasswordForm = { currPassword: string; newPassword: string };

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "working" | "upcoming";
  createdBy: string;
  addedMs: number;
  dueDate: string | null;
};

export type TaskForm = {
  title: string;
  description: string;
  status: "pending" | "completed" | "working" | "upcoming";
  dueDate: string | null;
};

export type RegisterForm = {
  name: string;
  avatar: string | null;
  email: string;
  password: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type ForgotPasswordForm = {
  otpEntered: number;
  email: string;
  newPassword: string;
};

export type AuthResponse = {
  message: string;
  success: boolean;
  user: User;
};
export type TaskResponse = {
  message: string;
  success: boolean;
  task: Task;
};
export type MultipleTasksResponse = {
  message: string;
  success: boolean;
  allTasks: Task[];
  lastPage: number;
};

export type ImageResponse = {
  secure_url: string | null;
};

export type TaskCardProps = {
  task: Task;
  page: number;
  upPage: number;
};

export type UpcomingTaskCardProps = {
  task: Task;
  page: number;
  upPage: number;
};

export type GeneralApiResponse = {
  message: string;
  success: boolean;
};
