"use client";

import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Web as LandingPageIcon,
  MenuBook as CurriculumIcon,
  AttachMoney as PricingIcon,
  Publish as PublishIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";

export type ManageTab = "landing-page" | "curriculum" | "pricing" | "publish";

interface CourseManageSidebarProps {
  activeTab: ManageTab;
  onTabChange: (tab: ManageTab) => void;
  isLandingComplete?: boolean;
  isCurriculumComplete?: boolean;
  isPricingComplete?: boolean;
  isPublishComplete?: boolean;
}

export const CourseManageSidebar: React.FC<CourseManageSidebarProps> = ({
  activeTab,
  onTabChange,
  isLandingComplete = false,
  isCurriculumComplete = false,
  isPricingComplete = false,
  isPublishComplete = false,
}) => {
  const steps = [
    {
      id: "landing-page" as ManageTab,
      label: "Course Landing Page",
      caption: "Title, subtitle, description, media",
      icon: <LandingPageIcon sx={{ fontSize: "1.2rem" }} />,
      completed: isLandingComplete,
    },
    {
      id: "curriculum" as ManageTab,
      label: "Curriculum & Syllabus",
      caption: "Sections, video lectures, PDFs",
      icon: <CurriculumIcon sx={{ fontSize: "1.2rem" }} />,
      completed: isCurriculumComplete,
    },
    {
      id: "pricing" as ManageTab,
      label: "Pricing & Currency",
      caption: "Course price tier (Step 3)",
      icon: <PricingIcon sx={{ fontSize: "1.2rem" }} />,
      completed: isPricingComplete,
    },
    {
      id: "publish" as ManageTab,
      label: "Publish & Status",
      caption: "Review & submit for approval (Step 4)",
      icon: <PublishIcon sx={{ fontSize: "1.2rem" }} />,
      completed: isPublishComplete,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, bgcolor: "action.hover" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
          Course Studio
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Step-by-step setup guide
        </Typography>
      </Box>

      <Divider />

      <List disablePadding>
        {steps.map((step) => {
          const isActive = activeTab === step.id;
          return (
            <ListItem key={step.id} disablePadding divider>
              <ListItemButton
                onClick={() => onTabChange(step.id)}
                selected={isActive}
                sx={{
                  py: 1.75,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(86, 36, 208, 0.15)"
                        : "rgba(86, 36, 208, 0.08)",
                    borderLeft: "3px solid",
                    borderColor: "primary.main",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {step.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "primary.main" : "text.primary",
                      }}
                    >
                      {step.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      {step.caption}
                    </Typography>
                  }
                />
                {step.completed ? (
                  <CheckCircleIcon sx={{ fontSize: "1rem", color: "success.main" }} />
                ) : (
                  <UncheckedIcon sx={{ fontSize: "1rem", color: "text.disabled" }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};
