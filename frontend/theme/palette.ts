import { PaletteMode, PaletteOptions } from "@mui/material";

export const MuiPalette = (mode: PaletteMode): PaletteOptions => {
  return {
    mode,
    primary: {
      main: "#5624D0", // Udemy Purple
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F05136", // Accent
    },
    background: {
      default: mode === "light" ? "#FFFFFF" : "#121212",
      paper: mode === "light" ? "#F8F8F8" : "#1E1E1E",
    },
    text: {
      primary: mode === "light" ? "#1C1C1C" : "#E0E0E0",
      secondary: mode === "light" ? "#555555" : "#B0B0B0",
    },
  };
};
