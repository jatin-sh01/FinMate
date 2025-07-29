import { createSlice } from "@reduxjs/toolkit";

// Function to get system theme preference
const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Function to get initial theme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }
  // Check system preference if no saved theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Function to get initial theme mode
const getInitialThemeMode = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }
  // Default to system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialState = {
  mode: getInitialThemeMode(), // 'light' or 'dark'
  theme: getInitialTheme(), // actual applied theme 'light' or 'dark'
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
      // Keep for compatibility but now updates based on system preference
      const systemTheme = getSystemTheme();
      state.theme = systemTheme;
      state.mode = systemTheme;
      localStorage.setItem("theme", systemTheme);
    },
  },
});

export const { setThemeMode, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
