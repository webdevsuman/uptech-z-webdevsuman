"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
  Undo as UndoIcon,
  OpenInNew as OpenInNewIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { ICourse } from "@/typescript/interface/course.interface";
import { useUpdateCourse } from "@/hooks/react-query/useUpdateCourse";
import { sToast } from "@/components/ui/alert/stoast";
import { ManageTab } from "./CourseManageSidebar";

interface CoursePublishFormProps {
  course: ICourse;
  onSaved?: () => void;
  onNavigateTab?: (tab: ManageTab) => void;
}

export const CoursePublishForm: React.FC<CoursePublishFormProps> = ({
  course,
  onSaved,
  onNavigateTab,
}) => {
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse(
    course._id || course.id || ""
  );

  const status = course.status || "draft";

  // Readiness Checklist Evaluation
  const hasTitle = Boolean(course.title && course.title.trim().length >= 5);
  const hasDescription = Boolean(course.description && course.description.trim().length >= 20);
  const hasCategory = Boolean(course.category);
  const hasThumbnail = Boolean(
    course.thumbnail &&
      (typeof course.thumbnail === "string"
        ? course.thumbnail.trim().length > 0
        : Boolean(course.thumbnail.url))
  );
  const hasPrice = typeof course.price === "number" && !isNaN(course.price);
  const sections = course.sections || [];
  const hasSections = sections.length > 0;
  const hasLectures = sections.some((s) => s.lectures && s.lectures.length > 0);

  const checklist = [
    {
      id: "title",
      label: "Course Title (at least 5 characters)",
      valid: hasTitle,
      tab: "landing-page" as ManageTab,
    },
    {
      id: "description",
      label: "Course Description (at least 20 characters)",
      valid: hasDescription,
      tab: "landing-page" as ManageTab,
    },
    {
      id: "category",
      label: "Course Category selected",
      valid: hasCategory,
      tab: "landing-page" as ManageTab,
    },
    {
      id: "thumbnail",
      label: "Course Thumbnail uploaded",
      valid: hasThumbnail,
      tab: "landing-page" as ManageTab,
    },
    {
      id: "sections",
      label: `Curriculum: At least 1 section created (${sections.length} created)`,
      valid: hasSections,
      tab: "curriculum" as ManageTab,
    },
    {
      id: "lectures",
      label: "Curriculum: At least 1 lecture added to syllabus",
      valid: hasLectures,
      tab: "curriculum" as ManageTab,
    },
    {
      id: "price",
      label: `Pricing Tier configured (${hasPrice ? (course.price === 0 ? "Free" : `₹${course.price}`) : "Not set"})`,
      valid: hasPrice,
      tab: "pricing" as ManageTab,
    },
  ];

  const allRequirementsMet = checklist.every((item) => item.valid);

  const handleStatusChange = async (nextStatus: "draft" | "under_review") => {
    try {
      await updateCourse({ status: nextStatus });
      if (nextStatus === "under_review") {
        sToast.success("Course submitted for review successfully!");
      } else {
        sToast.info("Submission withdrawn. Course returned to draft.");
      }
      if (onSaved) onSaved();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update course status";
      sToast.error(message);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
          Publish & Review
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Complete the course checklist before submitting your course to our quality
          moderation team for approval.
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Status Callout Banner */}
        {status === "published" && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            <AlertTitle sx={{ fontWeight: 700 }}>Course is Live!</AlertTitle>
            Your course is approved and available on the marketplace. Learners can now
            discover, enroll, and learn.
            <Box sx={{ mt: 2 }}>
              <Button
                component={Link}
                href={`/courses/${course._id || course.id}`}
                target="_blank"
                variant="outlined"
                color="success"
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: "1rem" }} />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                View Live Course Page
              </Button>
            </Box>
          </Alert>
        )}

        {status === "under_review" && (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <AlertTitle sx={{ fontWeight: 700 }}>Under Review</AlertTitle>
            Your course is currently in our moderation queue. Our team reviews course
            metadata, thumbnail, and descriptions within 2 business days.
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                disabled={isUpdating}
                onClick={() => handleStatusChange("draft")}
                startIcon={<UndoIcon />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {isUpdating ? "Withdrawing..." : "Withdraw Submission (Back to Draft)"}
              </Button>
            </Box>
          </Alert>
        )}

        {status === "draft" && (
          <Alert
            severity={allRequirementsMet ? "success" : "warning"}
            sx={{ borderRadius: 2 }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>
              {allRequirementsMet
                ? "Ready for Submission!"
                : "Course Setup in Progress (Draft)"}
            </AlertTitle>
            {allRequirementsMet
              ? "All required fields are completed. You can now submit your course for platform review."
              : "Complete the remaining items in the checklist below before you can submit for review."}
          </Alert>
        )}

        {/* Readiness Checklist */}
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ p: 2, bgcolor: "action.hover" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Submission Checklist
            </Typography>
          </Box>
          <Divider />
          <List disablePadding>
            {checklist.map((item) => (
              <ListItem
                key={item.id}
                divider
                secondaryAction={
                  !item.valid && onNavigateTab ? (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => onNavigateTab(item.tab)}
                      endIcon={<ArrowForwardIcon sx={{ fontSize: "0.9rem" }} />}
                      sx={{ textTransform: "none", fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      Complete
                    </Button>
                  ) : null
                }
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {item.valid ? (
                    <CheckCircleIcon sx={{ color: "success.main", fontSize: "1.25rem" }} />
                  ) : (
                    <CancelIcon sx={{ color: "error.main", fontSize: "1.25rem" }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: item.valid ? 500 : 600,
                        color: item.valid ? "text.primary" : "text.secondary",
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Action Button Footer */}
        {status === "draft" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!allRequirementsMet || isUpdating}
              onClick={() => handleStatusChange("under_review")}
              startIcon={
                isUpdating ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SendIcon sx={{ fontSize: "1.1rem" }} />
                )
              }
              sx={{ px: 4, py: 1.25, fontWeight: 700, textTransform: "none" }}
            >
              {isUpdating ? "Submitting..." : "Submit for Review"}
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
