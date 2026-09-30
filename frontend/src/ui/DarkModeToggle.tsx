"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "../../theme/MuiTheme";



export default function DarkModeToggle() {
  const { mode, toggleColorMode } = useThemeMode();

  return (
    <Tooltip
      title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <IconButton color="inherit" onClick={toggleColorMode}>
        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
