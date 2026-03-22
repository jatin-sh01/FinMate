import { createSlice } from "@reduxjs/toolkit";

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialThemeMode = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initialState = {
  mode: getInitialThemeMode(),
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      const mode = action.payload;
      state.mode = mode;
      state.theme = mode;
      localStorage.setItem("theme", mode);
    },
    updateSystemTheme: (state) => {
      const systemTheme = getSystemTheme();
      state.theme = systemTheme;
      state.mode = systemTheme;
      localStorage.setItem("theme", systemTheme);
    },
  },
});

export const { setThemeMode, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
