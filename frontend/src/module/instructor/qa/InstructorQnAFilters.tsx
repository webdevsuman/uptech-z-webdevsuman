"use client";

import React from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import { useInstructorCourses } from "@/hooks/react-query/useInstructorCourses";

interface InstructorQnAFiltersProps {
  courseId: string;
  onCourseChange: (val: string) => void;
  filter: "all" | "unanswered" | "answered";
  onFilterChange: (val: "all" | "unanswered" | "answered") => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export const InstructorQnAFilters: React.FC<InstructorQnAFiltersProps> = ({
  courseId,
  onCourseChange,
  filter,
  onFilterChange,
  search,
  onSearchChange,
}) => {
  const { data: courses = [] } = useInstructorCourses();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { md: "center" } }}
      >
        {/* Course Filter Dropdown & Search */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flex: 1 }}>
          <TextField
            select
            size="small"
            value={courseId}
            onChange={(e) => onCourseChange(e.target.value)}
            sx={{ minWidth: { sm: 220 } }}
          >
            <MenuItem value="">All Courses</MenuItem>
            {courses.map((c) => {
              const id = c._id || c.id || "";
              return (
                <MenuItem key={id} value={id}>
                  {c.title}
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            size="small"
            placeholder="Search in questions & answers..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        {/* Filter Toggle: All vs Unanswered vs Answered */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={filter}
          onChange={(_e, val) => {
            if (val) onFilterChange(val);
          }}
          sx={{
            alignSelf: { xs: "flex-start", md: "center" },
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              px: 2,
              py: 0.75,
              "&.Mui-selected": {
                bgcolor: "#5624D0",
                color: "#ffffff",
                "&:hover": { bgcolor: "#461da8" },
              },
            },
          }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="unanswered">Unanswered</ToggleButton>
          <ToggleButton value="answered">Answered</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
};
