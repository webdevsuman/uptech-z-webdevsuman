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
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import DarkModeToggle from "@/ui/DarkModeToggle";
import Link from "next/link";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Typography component="h1" variant="h6" sx={{fontWeight: "bold"}} className="cursor-pointer">
            UpTech-Z
          </Typography>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: "none", sm: "block" }, justifySelf:"center",paddingLeft:"150px" }}>
            {navItems.map((item) => (
              <Link key={item.id} href={item.path}>
                <Button color="inherit">{item.name}</Button>
              </Link>
            ))}
            {/* {role == "instructor" && (
              <Link href={`/instructor/dashboard`}>
                <Button color="inherit">Dashboard</Button>
              </Link>
            )}
            {role == "student" && (
              <Link href={`/student/dashboard`}>
                <Button color="inherit">Dashboard</Button>
              </Link>
            )}
            {role == "admin" && (
              <Link href={`/admin`}>
                <Button color="inherit">Admin Dashboard</Button>
              </Link>
            )} */}
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          </List>
        </Box>
      </Drawer>
    </>
  );
}
