"use client";

import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

interface InstructorQnAHeaderProps {
  total: number;
  unanswered: number;
  answered: number;
}

export const InstructorQnAHeader: React.FC<InstructorQnAHeaderProps> = ({
  total,
  unanswered,
  answered,
}) => {
  return (
    <Box
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        gap: 2,
      }}
    >
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "rgba(86,36,208,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QuestionAnswerIcon sx={{ color: "#5624D0", fontSize: 20 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
            Student Q&A
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Monitor student discussions, answer inquiries, and foster course engagement.
        </Typography>
      </Box>

      {/* Metric Counters */}
      <Stack direction="row" spacing={1.5}>
        <Chip
          label={`${total} Total Questions`}
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: "0.8rem", borderRadius: 1.5 }}
        />
        <Chip
          label={`${unanswered} Unanswered`}
          color={unanswered > 0 ? "warning" : "default"}
          sx={{ fontWeight: 700, fontSize: "0.8rem", borderRadius: 1.5 }}
        />
        <Chip
          label={`${answered} Answered`}
          color="success"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: "0.8rem", borderRadius: 1.5 }}
        />
      </Stack>
    </Box>
  );
};
