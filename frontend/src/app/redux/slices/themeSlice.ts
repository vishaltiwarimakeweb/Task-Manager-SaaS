import { Theme } from "@/app/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Theme = {
  theme: "light",
  toastTheme: "dark",
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      state.toastTheme = state.theme === "light" ? "dark" : "colored";
      const htmlTag = document.querySelector("html");
      htmlTag?.classList.remove("light");
      htmlTag?.classList.remove("dark");
      htmlTag?.classList.add(state.theme);
      localStorage.setItem("theme", state.theme);
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      state.toastTheme = action.payload === "light" ? "dark" : "colored";
      const htmlTag = document.querySelector("html");
      htmlTag?.classList.remove("light");
      htmlTag?.classList.remove("dark");
      htmlTag?.classList.add(action.payload);
    },
  },
});
export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
