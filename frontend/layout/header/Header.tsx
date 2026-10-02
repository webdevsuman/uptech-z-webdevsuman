"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import DarkModeToggle from "@/ui/DarkModeToggle";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, logout } = useAuth();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { id: "1", name: "Home", path: "/" },
    { id: "2", name: "Courses", path: "/courses" },
    { id: "3", name: "About", path: "#footer" },
  ];

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link href="/">
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={200}
              height={50}
              priority
              className="cursor-pointer"
            />
          </Link>

          {/* Desktop Nav */}
          <Box
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}
          >
            {navItems.map((item) => (
              <Link key={item.id} href={item.path}>
                <Button color="inherit">{item.name}</Button>
              </Link>
            ))}

            {role === "instructor" && (
              <Link href="/instructor/dashboard">
                <Button color="inherit">Dashboard</Button>
              </Link>
            )}
            {role === "student" && (
              <Link href="/student/dashboard">
                <Button color="inherit">Dashboard</Button>
              </Link>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {!user ? (
              <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
                <Link href="/login">
                  <Button color="inherit">Login</Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outlined"
                    sx={{
                      bgcolor: "white",
                      color: "black",
                      borderColor: "white",
                      "&:hover": { bgcolor: "#f2f2f2", borderColor: "white" },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </Box>
            ) : (
              <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
                <span className="text-sm font-medium text-white/90">
                  {user.name} <span className="text-xs opacity-75 capitalize">({role})</span>
                </span>
                <Button
                  color="inherit"
                  size="small"
                  onClick={logout}
                  sx={{ textTransform: "none", ml: 1, border: "1px solid rgba(255,255,255,0.4)" }}
                >
                  Logout
                </Button>
              </Box>
            )}

            <DarkModeToggle />
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navItems.map((text) => (
              <Link key={text.id} href={text.path}>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleDrawerToggle}>
                    <ListItemText primary={text.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}

            {role === "instructor" && (
              <Link href="/instructor/dashboard">
                <ListItem disablePadding>
                  <ListItemButton onClick={handleDrawerToggle}>
                    <ListItemText primary="Instructor Dashboard" />
                  </ListItemButton>
                </ListItem>
              </Link>
            )}

            {role === "student" && (
              <Link href="/student/dashboard">
                <ListItem disablePadding>
                  <ListItemButton onClick={handleDrawerToggle}>
                    <ListItemText primary="Student Dashboard" />
                  </ListItemButton>
                </ListItem>
              </Link>
            )}

            {!user ? (
              <>
                <Link href="/login">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerToggle}>
                      <ListItemText primary="Login" />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link href="/register">
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleDrawerToggle}>
                      <ListItemText primary="Sign Up" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    logout();
                    handleDrawerToggle();
                  }}
                >
                  <ListItemText primary={`Logout (${user.name})`} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

