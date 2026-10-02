"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon,
}: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: 1.5,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(86, 36, 208, 0.15)"
                  : "rgba(86, 36, 208, 0.08)",
              color: "primary.main",
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Stack
          direction="row"
          sx={{ alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "1.5rem",
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  mt: 0.5,
                  display: "block",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {change && (
            <Chip
              size="small"
              label={`${isPositive ? "↑" : "↓"} ${change}`}
              color={isPositive ? "success" : "error"}
              variant="outlined"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: 1,
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
