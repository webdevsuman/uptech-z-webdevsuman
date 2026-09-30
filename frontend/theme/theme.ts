import { createTheme, PaletteMode, ThemeOptions } from "@mui/material/styles";
import { MuiPalette } from "./palette";

export const MuiThemeOptions = (mode: PaletteMode): ThemeOptions => {
  return {
    palette: MuiPalette(mode),
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      button: { textTransform: "none" },
    },
    shape: {
      borderRadius: 8,
    },
  };
};
