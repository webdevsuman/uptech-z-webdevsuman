"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  Box,
  Stack,
  Button,
  LinearProgress,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { StepCourseType } from "./StepCourseType";
import { StepCourseTitle } from "./StepCourseTitle";
import { StepCourseCategory } from "./StepCourseCategory";
import { CourseCreateFormData } from "../zod/courseCreate.zod";
import { useCreateCourse } from "@/hooks/react-query/useCreateCourse";
import { sToast } from "@/components/ui/alert/stoast";

export const CourseCreateWizard: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<CourseCreateFormData>({
    courseType: "course",
    title: "",
    category: "",
  });
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({});

  const { mutateAsync: createCourse, isPending } = useCreateCourse();

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!formData.title.trim() || formData.title.trim().length < 5) {
        setErrors((prev) => ({
          ...prev,
          title: "Title must be at least 5 characters long.",
        }));
        return;
      }
      setErrors((prev) => ({ ...prev, title: undefined }));
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.category || !/^[0-9a-fA-F]{24}$/.test(formData.category)) {
      setErrors((prev) => ({
        ...prev,
        category: "Please select a valid course category.",
      }));
      return;
    }

    try {
      const res = await createCourse({
        title: formData.title.trim(),
        category: formData.category,
      });

      sToast.success(res.message || "Course draft created successfully!");
      const createdId = res.data._id || res.data.id;
      // Seamlessly transition to Step 2: Course Landing Page Studio
      router.push(`/instructor/courses/${createdId}/manage`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create course draft.";
      sToast.error(message);
    }
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 520,
      }}
    >
      {/* Top Progress Bar */}
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 6,
            bgcolor: "action.hover",
            "& .MuiLinearProgress-bar": {
              bgcolor: "primary.main",
            },
          }}
        />
        <Box
          sx={{
            px: { xs: 2, sm: 4 },
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
            Step {step} of 3
          </Typography>
          <Button
            size="small"
            color="inherit"
            onClick={() => router.push("/instructor/dashboard")}
            sx={{ textTransform: "none", fontSize: "0.8rem", color: "text.secondary" }}
          >
            Exit Creation
          </Button>
        </Box>
      </Box>

      {/* Main Step Content */}
      <Box sx={{ flexGrow: 1, p: { xs: 2.5, sm: 4, md: 5 } }}>
        {step === 1 && (
          <StepCourseType
            value={formData.courseType}
            onChange={(val) => setFormData((prev) => ({ ...prev, courseType: val }))}
          />
        )}

        {step === 2 && (
          <StepCourseTitle
            value={formData.title}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, title: val }));
              if (val.trim().length >= 5) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            error={errors.title}
          />
        )}

        {step === 3 && (
          <StepCourseCategory
            value={formData.category}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, category: val }));
              if (val) {
                setErrors((prev) => ({ ...prev, category: undefined }));
              }
            }}
            error={errors.category}
          />
        )}
      </Box>

      {/* Bottom Sticky Footer */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={handlePrev}
          disabled={step === 1 || isPending}
          startIcon={<ArrowBackIcon sx={{ fontSize: "1rem" }} />}
          sx={{ textTransform: "none", fontWeight: 600, px: 2.5 }}
        >
          Previous
        </Button>

        {step < 3 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
            sx={{ textTransform: "none", fontWeight: 600, px: 3 }}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isPending}
            sx={{ textTransform: "none", fontWeight: 600, px: 3.5, minWidth: 140 }}
          >
            {isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create Course"
            )}
          </Button>
        )}
      </Box>
    </Paper>
  );
};
