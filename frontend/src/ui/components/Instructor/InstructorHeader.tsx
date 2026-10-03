"use client";

import React from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Button,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import DarkModeToggle from "@/ui/DarkModeToggle";
import { getInitials } from "@/utils/functions/label.lib";
import { getRoleName } from "@/utils/functions/auth.lib";

interface InstructorHeaderProps {
  onToggleMobileMenu: () => void;
}

export default function InstructorHeader({
  onToggleMobileMenu,
}: InstructorHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
        {/* Left: Mobile Toggle & Title */}
        <Stack direction="row" sx={{alignItems:"center"}} spacing={1.5}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleMobileMenu}
            sx={{ display: { lg: "none" } }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
              Instructor Studio
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: { xs: "none", sm: "block" },
              }}
            >
              Manage your courses, learners, and curriculum
            </Typography>
          </Box>
        </Stack>

        {/* Right: Actions */}
        <Stack direction={"row"} sx={{alignItems: "center"}} spacing={1.5} >
          <Button
            component={Link}
            href="/instructor/courses/create"
            variant="contained"
            color="primary"
            startIcon={<AddIcon sx={{ fontSize: "1.1rem" }} />}
            sx={{
              fontWeight: 600,
              fontSize: "0.8rem",
              py: 0.75,
              px: 1.75,
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              New Course
            </Box>
          </Button>

          <DarkModeToggle />

          <Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />

          {/* User Profile Info */}
          <Stack direction="row" sx={{alignItems:"center"}} spacing={1}>
            <Avatar
              src={user?.profilePicture || user?.avatar || undefined}
              sx={{
                width: 34,
                height: 34,
                bgcolor: "primary.main",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {getInitials(user?.name)}
            </Avatar>

            <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "left" }}>
              <Typography sx={{ variant: "body2", fontWeight: 600, color: "text.primary", lineHeight: 1.2, fontSize: "0.875rem" }}>
                {user?.name || "Instructor"}
              </Typography>
              <Typography sx={{ variant: "caption", color: "text.secondary", textTransform: "capitalize", fontSize: "0.75rem" }}>
                {getRoleName(user?.role) || "Instructor"}
              </Typography>
            </Box>

            <Button
              color="error"
              onClick={logout}
              sx={{
                minWidth: "auto",
                px: 1,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Logout
            </Button>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
