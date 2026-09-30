"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { MuiThemeOptions } from "./theme";

type ThemeContextType = {
  toggleColorMode: () => void;
  mode: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  mode: "light",
});

export const useThemeMode = () => useContext(ThemeContext);

const MuiTheme = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    return createTheme(MuiThemeOptions(mode));
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default MuiTheme;
