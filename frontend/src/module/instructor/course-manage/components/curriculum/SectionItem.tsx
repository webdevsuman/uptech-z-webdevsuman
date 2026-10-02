"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DeleteOutlined as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { ISection } from "@/typescript/interface/course.interface";
import {
  useUpdateSection,
  useDeleteSection,
  useAddLecture,
} from "@/hooks/react-query/useCurriculum";
import { LectureItem } from "./LectureItem";
import { sToast } from "@/components/ui/alert/stoast";

interface SectionItemProps {
  courseId: string;
  section: ISection;
  index: number;
}

export const SectionItem: React.FC<SectionItemProps> = ({
  courseId,
  section,
  index,
}) => {
  const sectionId = section._id || section.id || "";
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title);

  // New Lecture state
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState("");

  const { mutateAsync: updateSection } = useUpdateSection(courseId);
  const { mutateAsync: deleteSection } = useDeleteSection(courseId);
  const { mutateAsync: addLecture, isPending: isAdding } = useAddLecture(courseId);

  const handleSaveTitle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!title.trim()) {
      sToast.error("Section title cannot be empty");
      return;
    }
    try {
      await updateSection({ sectionId, title: title.trim() });
      setIsEditingTitle(false);
      sToast.success("Section renamed");
    } catch {
      sToast.error("Failed to rename section");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this section and all its lectures?")) {
      return;
    }
    try {
      await deleteSection({ sectionId });
      sToast.info("Section deleted");
    } catch {
      sToast.error("Failed to delete section");
    }
  };

  const handleCreateLecture = async () => {
    if (!newLectureTitle.trim()) {
      sToast.error("Please provide a lecture title");
      return;
    }
    try {
      await addLecture({
        sectionId,
        title: newLectureTitle.trim(),
      });
      setNewLectureTitle("");
      setIsAddingLecture(false);
      sToast.success("Lecture added to section");
    } catch {
      sToast.error("Failed to add lecture");
    }
  };

  const lectures = section.lectures || [];

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        mb: 2.5,
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ px: 2.5, py: 1, bgcolor: "action.hover" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mr: 1,
            gap: 1,
          }}
        >
          {isEditingTitle ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{alignItems:"center", flex:1}}
              onClick={(e) => e.stopPropagation()}
            >
              <TextField
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <IconButton size="small" color="primary" onClick={handleSaveTitle}>
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setTitle(section.title);
                  setIsEditingTitle(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Section {index + 1}: {section.title}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={1}
            sx={{alignItems:"center"}}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="caption" sx={{ color: "text.secondary", mr: 1 }}>
              {lectures.length} lecture{lectures.length !== 1 ? "s" : ""}
            </Typography>
            {!isEditingTitle && (
              <IconButton size="small" onClick={() => setIsEditingTitle(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </AccordionSummary>

      <Divider />

      <AccordionDetails sx={{ p: 2.5, bgcolor: "background.paper" }}>
        {/* Lecture List */}
        {lectures.length === 0 ? (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No lectures added yet to this section.
            </Typography>
          </Box>
        ) : (
          lectures.map((lecture, lIdx) => (
            <LectureItem
              key={lecture._id || lecture.id || lIdx}
              courseId={courseId}
              sectionId={sectionId}
              lecture={lecture}
              index={lIdx}
            />
          ))
        )}

        {/* Add Lecture Button or Form */}
        {isAddingLecture ? (
          <Stack
            spacing={1.5}
            sx={{
              mt: 1.5,
              p: 2,
              border: "1px dashed",
              borderColor: "primary.main",
              borderRadius: 1.5,
              bgcolor: "action.hover",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              New Lecture
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="e.g. Introduction to React Server Components"
              value={newLectureTitle}
              onChange={(e) => setNewLectureTitle(e.target.value)}
              autoFocus
            />
            <Stack direction="row" spacing={1} sx={{justifyContent:"flex-end"}}>
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={() => {
                  setIsAddingLecture(false);
                  setNewLectureTitle("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={isAdding}
                onClick={handleCreateLecture}
              >
                {isAdding ? "Adding..." : "Add Lecture"}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddingLecture(true)}
            sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          >
            Add Lecture
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
