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
  FormControlLabel,
  Checkbox,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DeleteOutlined as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  PlayCircle as VideoBadgeIcon,
  Description as DocBadgeIcon,
} from "@mui/icons-material";
import { ILecture } from "@/typescript/interface/course.interface";
import {
  useUpdateLecture,
  useDeleteLecture,
} from "@/hooks/react-query/useCurriculum";
import { VideoUploader } from "./VideoUploader";
import { ResourceUploader } from "./ResourceUploader";
import { sToast } from "@/components/ui/alert/stoast";

interface LectureItemProps {
  courseId: string;
  sectionId: string;
  lecture: ILecture;
  index: number;
}

export const LectureItem: React.FC<LectureItemProps> = ({
  courseId,
  sectionId,
  lecture,
  index,
}) => {
  const lectureId = lecture._id || lecture.id || "";
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);

  const { mutateAsync: updateLecture } = useUpdateLecture(courseId);
  const { mutateAsync: deleteLecture } = useDeleteLecture(courseId);

  const handleSaveTitle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!title.trim()) {
      sToast.error("Lecture title cannot be empty");
      return;
    }
    try {
      await updateLecture({
        sectionId,
        lectureId,
        payload: { title: title.trim() },
      });
      setIsEditing(false);
      sToast.success("Lecture renamed");
    } catch {
      sToast.error("Failed to rename lecture");
    }
  };

  const handleTogglePreview = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isPreview = e.target.checked;
    try {
      await updateLecture({
        sectionId,
        lectureId,
        payload: { isPreview },
      });
      sToast.success(
        isPreview ? "Lecture set as Free Preview" : "Free Preview disabled",
      );
    } catch {
      sToast.error("Failed to update preview setting");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteLecture({ sectionId, lectureId });
      sToast.info("Lecture deleted");
    } catch {
      sToast.error("Failed to delete lecture");
    }
  };

  const hasVideo = Boolean(lecture.video?.url);
  const resourceCount = lecture.resources?.length || 0;

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        mb: 1.5,
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ px: 2, py: 0.5, bgcolor: "background.paper" }}
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
          {isEditing ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{flex:1, alignItems: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <TextField
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <IconButton
                size="small"
                color="primary"
                onClick={handleSaveTitle}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setTitle(lecture.title);
                  setIsEditing(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ flex: 1, alignItems: "center" }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {index + 1}. {lecture.title}
              </Typography>
              {hasVideo && (
                <Tooltip title="Video attached">
                  <Chip
                    icon={
                      <VideoBadgeIcon sx={{ fontSize: "1rem !important" }} />
                    }
                    label="Video"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Tooltip>
              )}
              {resourceCount > 0 && (
                <Tooltip title={`${resourceCount} attachment(s)`}>
                  <Chip
                    icon={<DocBadgeIcon sx={{ fontSize: "1rem !important" }} />}
                    label={`${resourceCount} files`}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              )}
            </Stack>
          )}

          <Stack
            direction="row"
            spacing={1}
            sx={{alignItems:"center"}}
            onClick={(e) => e.stopPropagation()}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={Boolean(lecture.isPreview)}
                  onChange={handleTogglePreview}
                />
              }
              label={
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Free Preview
                </Typography>
              }
            />
            {!isEditing && (
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          pt: 1,
          pb: 2,
          px: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <VideoUploader
          courseId={courseId}
          sectionId={sectionId}
          lecture={lecture}
        />
        <ResourceUploader
          courseId={courseId}
          sectionId={sectionId}
          lecture={lecture}
        />
      </AccordionDetails>
    </Accordion>
  );
};
