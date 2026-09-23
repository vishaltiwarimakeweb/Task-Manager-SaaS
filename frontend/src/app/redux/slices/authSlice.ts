import { AuthResponse, LoginForm, RegisterForm, User } from "@/app/types/types";
import { baseURL } from "@/app/utils/baseURL";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
interface AuthState {
  user: User | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  user: {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    createdAt: "",
  },
  isLogin: false,
};
export const registerUser = createAsyncThunk<AuthResponse, RegisterForm>(
  "auth/registerUser",
  async (form) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const registerData = await response.json();
      return registerData;
    } catch (error) {
      console.error(error);
    }
  },
);
export const loginUser = createAsyncThunk<AuthResponse, LoginForm>(
  "auth/loginUser",
  async (form) => {
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const loginData = await response.json();

    return loginData;
  },
);
export const logOutUser = createAsyncThunk("auth/logout", async () => {
  const logOutResponse = await fetch(`${baseURL}/api/auth/logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const logOutData = await logOutResponse.json();
  return logOutData;
});
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLogin = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isLogin = true;
          localStorage.setItem("currUser", JSON.stringify(action.payload.user));
        }
      },
    );
    builder.addCase(logOutUser.fulfilled, (state) => {
      state.user = null;
      state.isLogin = false;
      localStorage.removeItem("currUser");
    });
  },
});
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
