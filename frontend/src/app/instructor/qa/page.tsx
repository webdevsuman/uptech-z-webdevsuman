"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Stack, Box, Typography, CircularProgress } from "@mui/material";
import { InstructorQnAHeader } from "@/module/instructor/qa/InstructorQnAHeader";
import { InstructorQnAFilters } from "@/module/instructor/qa/InstructorQnAFilters";
import { InstructorQnACard } from "@/module/instructor/qa/InstructorQnACard";
import { useInstructorQuestions } from "@/hooks/react-query/useQnA";

function InstructorQnAContent() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get("courseId") || "";

  const [courseId, setCourseId] = useState<string>(initialCourseId);
  const [filter, setFilter] = useState<"all" | "unanswered" | "answered">("all");
  const [search, setSearch] = useState<string>("");

  const { data, isLoading } = useInstructorQuestions({
    courseId: courseId || undefined,
    filter,
    search: search || undefined,
  });

  const questions = data?.questions ?? [];
  const counts = data?.counts ?? { total: 0, unanswered: 0, answered: 0 };

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* 1. Header with Global Counters */}
      <InstructorQnAHeader
        total={counts.total}
        unanswered={counts.unanswered}
        answered={counts.answered}
      />

      {/* 2. Filter Bar (Course selection, search, tab toggle) */}
      <InstructorQnAFilters
        courseId={courseId}
        onCourseChange={setCourseId}
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {/* 3. Questions List */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={36} sx={{ color: "#5624D0" }} />
        </Box>
      ) : questions.length === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2.5,
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
            No Questions Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto" }}>
            {search.trim() || courseId || filter !== "all"
              ? "No questions match your current filter criteria. Try adjusting your course filter or search keywords."
              : "Students haven't asked any questions in your courses yet. When questions are posted, they will appear here."}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2.5}>
          {questions.map((q) => (
            <InstructorQnACard key={q._id || q.id} question={q} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default function InstructorQnAPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={36} sx={{ color: "#5624D0" }} />
        </Box>
      }
    >
      <InstructorQnAContent />
    </Suspense>
  );
}
