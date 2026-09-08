import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/taskSlice";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    task: taskReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
