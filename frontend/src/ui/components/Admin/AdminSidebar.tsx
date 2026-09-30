"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/categories-tags", label: "Categories & Tags" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {items.map((it) => (
            <Link key={it.href} href={it.href}>
              <ListItemButton selected={pathname === it.href}>
                <ListItemText primary={it.label} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
