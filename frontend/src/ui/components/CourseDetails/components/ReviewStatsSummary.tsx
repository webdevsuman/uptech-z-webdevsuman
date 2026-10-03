"use client";

import React from "react";
import { Box, Typography, Rating, LinearProgress, Stack } from "@mui/material";
import { IReviewStats } from "@/typescript/interface/review.interface";

interface ReviewStatsSummaryProps {
  stats: IReviewStats;
}

export default function ReviewStatsSummary({ stats }: ReviewStatsSummaryProps) {
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 4,
        mb: 4,
        p: 3,
        bgcolor: "background.default",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Overall Score */}
      <Box sx={{ textAlign: "center", minWidth: 120 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, color: "#b4690e" }}>
          {stats.avgRating.toFixed(1)}
        </Typography>
        <Rating
          value={stats.avgRating}
          precision={0.1}
          readOnly
          size="medium"
          sx={{ mb: 0.5 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 600 }}>
          {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
        </Typography>
      </Box>

      {/* Distribution Bars */}
      <Box sx={{ flex: 1, width: "100%" }}>
        <Stack spacing={1}>
          {stars.map((star) => {
            const count = stats.distribution[star] || 0;
            const percent = stats.distributionPercentages[star] || 0;
            return (
              <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="body2" sx={{ width: 45, fontWeight: 600, color: "text.secondary" }}>
                  {star} star
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#b4690e",
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ width: 40, textAlign: "right", color: "text.secondary" }}>
                  {percent}%
                </Typography>
                <Typography variant="caption" sx={{ width: 30, textAlign: "right", color: "text.disabled" }}>
                  ({count})
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
