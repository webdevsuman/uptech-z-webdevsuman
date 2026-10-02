"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  VideoLibrary as VideoIcon,
  MenuBook as SectionIcon,
  Article as DocIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { ICourse } from "@/typescript/interface/course.interface";
import { useAddSection } from "@/hooks/react-query/useCurriculum";
import { SectionItem } from "./SectionItem";
import { sToast } from "@/components/ui/alert/stoast";

interface CurriculumManagerProps {
  course: ICourse;
  onProceedToPricing?: () => void;
}

export const CurriculumManager: React.FC<CurriculumManagerProps> = ({
  course,
  onProceedToPricing,
}) => {
  const courseId = course._id || course.id || "";
  const sections = course.sections || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const { mutateAsync: addSection, isPending: isAdding } = useAddSection(courseId);

  // Compute stats
  const totalSections = sections.length;
  const totalLectures = sections.reduce(
    (acc, s) => acc + (s.lectures?.length || 0),
    0
  );
  const totalVideos = sections.reduce(
    (acc, s) =>
      acc + (s.lectures?.filter((l) => Boolean(l.video?.url)).length || 0),
    0
  );
  const totalMaterials = sections.reduce(
    (acc, s) =>
      acc +
      (s.lectures?.reduce((rAcc, l) => rAcc + (l.resources?.length || 0), 0) || 0),
    0
  );

  const handleCreateSection = async () => {
    if (!newSectionTitle.trim()) {
      sToast.error("Section title is required");
      return;
    }
    try {
      await addSection({ title: newSectionTitle.trim() });
      setNewSectionTitle("");
      setIsDialogOpen(false);
      sToast.success("New section added to syllabus");
    } catch {
      sToast.error("Failed to add section");
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
      {/* Title & Description */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            Curriculum & Syllabus
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Organize your course into structured sections, upload video lectures, and attach downloadable materials.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={{ textTransform: "none", fontWeight: 600, px: 2.5, whiteSpace: "nowrap" }}
        >
          Add Section
        </Button>
      </Box>

      {/* Summary Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                <SectionIcon color="primary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {totalSections}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sections
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                <VideoIcon color="secondary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {totalLectures}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lectures
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                <VideoIcon color="success" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {totalVideos}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Videos
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack direction="row" spacing={1.5} sx={{alignItems:"center"}}>
                <DocIcon color="info" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {totalMaterials}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Materials / PDFs
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
            border: "1.5px dashed",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            No syllabus created yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 450, mx: "auto" }}>
            Start building your course structure by creating your first section. Then, add lectures, videos, and exercises.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Create First Section
          </Button>
        </Box>
      ) : (
        <Box>
          {sections.map((section, idx) => (
            <SectionItem
              key={section._id || section.id || idx}
              courseId={courseId}
              section={section}
              index={idx}
            />
          ))}
        </Box>
      )}

      {/* Footer Navigation */}
      {onProceedToPricing && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
            pt: 2.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={onProceedToPricing}
            sx={{ px: 3.5, py: 1.25, fontWeight: 700, textTransform: "none" }}
          >
            Proceed to Pricing & Currency
          </Button>
        </Box>
      )}

      {/* Add Section Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Section</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sections divide your course into logical chapters or modules (e.g. &quot;Getting Started&quot;, &quot;Advanced Concepts&quot;).
          </Typography>
          <TextField
            autoFocus
            label="Section Title"
            fullWidth
            placeholder="e.g. Introduction & Setup"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isAdding}
            onClick={handleCreateSection}
          >
            {isAdding ? "Adding..." : "Add Section"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
