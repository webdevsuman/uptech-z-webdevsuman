"use client";

import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useCategories } from "@/hooks/react-query/useCategories";
import * as MuiIcons from "@mui/icons-material";
import * as LucideIcons from "lucide-react";
import { TitleSubheading } from "../TitleSubheading";

const toPascalCase = (str: string): string => {
  return str
    .split(/[-_:]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

interface CategoryIconProps {
  iconName?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName }) => {
  if (!iconName) {
    return <MuiIcons.Folder fontSize="large" color="primary" />;
  }

  const trimmed = iconName.trim();

  // 1. If icon starts with "lucide:", dynamically resolve from lucide-react with primary theme color
  if (trimmed.startsWith("lucide:")) {
    const rawName = trimmed.slice(7).trim();
    const pascalName = toPascalCase(rawName);
    const LucideComponent = (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{ size?: number; className?: string }>
      >
    )[pascalName];

    if (LucideComponent) {
      return (
        <Box
          sx={{
            color: "primary.main",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LucideComponent size={32} />
        </Box>
      );
    }
  }

  // 2. Otherwise treat as Material icon, dynamically resolve from @mui/icons-material with fontSize="large" & color="primary"
  const cleanMuiName = trimmed.replace(/Icon$/, "");
  const pascalMuiName = toPascalCase(cleanMuiName);
  const MuiComponent = (
    MuiIcons as unknown as Record<
      string,
      React.ComponentType<{ fontSize?: "large" | "medium" | "small"; color?: "primary" | "secondary" | "action" | "disabled" | "error" | "inherit" }>
    >
  )[pascalMuiName] || (
    MuiIcons as unknown as Record<
      string,
      React.ComponentType<{ fontSize?: "large" | "medium" | "small"; color?: "primary" | "secondary" | "action" | "disabled" | "error" | "inherit" }>
    >
  )[trimmed];

  if (MuiComponent) {
    return <MuiComponent fontSize="large" color="primary" />;
  }

  // 3. Fallback icon when unmapped
  return <MuiIcons.Folder fontSize="large" color="primary" />;
};

interface CategorySectionProps {
  title?: string;
  description?: string;
  onSelect?: (id: string) => void;
}

export const CategorySection = ({
  title,
  description,
  onSelect,
}: CategorySectionProps) => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <Typography sx={{ my: 4 }}>Loading categories...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ my: 4 }}>
        Failed to load categories
      </Typography>
    );
  }

  return (
    <Box sx={{ my: 6 }}>
      {title && <TitleSubheading title={title} subheading={description} />}
      <Grid container spacing={3} className="mt-5">
        {categories?.map((cat) => (
          <Grid key={cat._id || cat.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Paper
              className="flex items-center justify-center gap-2"
              onClick={() => {
                const categoryId = String(cat._id || cat.id || "");
                onSelect?.(categoryId);
                const targetElement = document.getElementById("courses");
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
              sx={{
                py: 2,
                textAlign: "center",
                borderRadius: 2,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              }}
              elevation={2}
            >
              <CategoryIcon iconName={cat.icon} />
              <Typography variant="h6">{cat.name}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategorySection;
