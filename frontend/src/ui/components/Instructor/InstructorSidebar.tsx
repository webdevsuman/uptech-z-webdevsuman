"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  Box,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Add as AddIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Campaign as CampaignIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 250;

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/instructor/dashboard", icon: <DashboardIcon sx={{ fontSize: "1.25rem" }} /> },
  { name: "My Courses", href: "/instructor/courses", icon: <MenuBookIcon sx={{ fontSize: "1.25rem" }} /> },
  { name: "Create Course", href: "/instructor/courses/create", icon: <AddIcon sx={{ fontSize: "1.25rem" }} /> },
  { name: "Student Q&A", href: "/instructor/qa", icon: <QuestionAnswerIcon sx={{ fontSize: "1.25rem" }} /> },
  { name: "Announcements", href: "/instructor/announcements", icon: <CampaignIcon sx={{ fontSize: "1.25rem" }} /> },
  { name: "Profile", href: "/instructor/profile", icon: <PersonIcon sx={{ fontSize: "1.25rem" }} /> },
];

interface InstructorSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function InstructorSidebar({
  mobileOpen,
  onClose,
}: InstructorSidebarProps) {
  const pathname = usePathname();

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box component={Link} href="/" sx={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/Logo.svg"
            alt="UpTech-Z Logo"
            width={200}
            height={50}
            priority
          />
        </Box>
        <Chip
          label="Instructor"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 700, fontSize: "0.65rem", height: 22 }}
        />
      </Box>

      {/* Navigation List */}
      <Box sx={{ flex: 1, py: 2, px: 1.5, overflowY: "auto" }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            mb: 1,
            display: "block",
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "text.secondary",
          }}
        >
          MANAGEMENT
        </Typography>

        <List disablePadding>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/instructor/dashboard" && pathname?.startsWith(item.href));

            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={onClose}
                  selected={isActive}
                  sx={{
                    borderRadius: 1.5,
                    py: 1,
                    px: 2,
                    "&.Mui-selected": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(86, 36, 208, 0.2)"
                          : "rgba(86, 36, 208, 0.08)",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? "primary.main" : "text.primary",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* Switch to Student Portal */}
      <Box sx={{ p: 2 }}>
        <Button
          component={Link}
          href="/"
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<SchoolIcon sx={{ fontSize: "1.1rem" }} />}
          sx={{
            textTransform: "none",
            fontSize: "0.8rem",
            py: 1,
            fontWeight: 600,
            borderColor: "divider",
          }}
        >
          Switch to Student View
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
