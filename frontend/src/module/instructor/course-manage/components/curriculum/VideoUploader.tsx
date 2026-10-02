"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  PlayCircleOutlined as VideoIcon,
  DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";
import { ILecture } from "@/typescript/interface/course.interface";
import { useUpdateLecture } from "@/hooks/react-query/useCurriculum";
import { sToast } from "@/components/ui/alert/stoast";

interface VideoUploaderProps {
  courseId: string;
  sectionId: string;
  lecture: ILecture;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  courseId,
  sectionId,
  lecture,
}) => {
  const lectureId = lecture._id || lecture.id || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: updateLecture } = useUpdateLecture(courseId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 100MB
    const maxSizeBytes = 100 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      sToast.error("Video file size cannot exceed 100MB");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      setIsUploading(true);
      await updateLecture({
        sectionId,
        lectureId,
        payload: formData,
      });
      sToast.success("Video lecture uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload video";
      sToast.error(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveVideo = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("removeVideo", "true");
      await updateLecture({
        sectionId,
        lectureId,
        payload: formData,
      });
      sToast.info("Video removed from lecture");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove video";
      sToast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs} min`;
  };

  return (
    <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
      <input
        type="file"
        ref={fileInputRef}
        accept="video/mp4,video/webm,video/quicktime"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {lecture.video?.url ? (
        <Stack spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Stack direction="row" spacing={1} sx={{alignItems:"center"}}>
              <VideoIcon color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Video Lecture Ready
              </Typography>
              <Chip
                label={formatDuration(lecture.video.duration)}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                Replace Video
              </Button>
              <Button
                size="small"
                color="error"
                variant="text"
                disabled={isUploading}
                startIcon={<DeleteIcon />}
                onClick={handleRemoveVideo}
              >
                Remove
              </Button>
            </Stack>
          </Box>

          <Box
            component="video"
            controls
            src={lecture.video.url}
            sx={{
              width: "100%",
              maxHeight: 240,
              borderRadius: 1.5,
              bgcolor: "black",
            }}
          />
        </Stack>
      ) : (
        <Box
          sx={{
            border: "1.5px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            cursor: isUploading ? "not-allowed" : "pointer",
            "&:hover": { borderColor: "primary.main" },
          }}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Stack spacing={1} sx={{alignItems:"center"}}>
              <CircularProgress size={28} />
              <Typography variant="caption" color="text.secondary">
                Uploading and transcoding video (Cloudinary)...
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={1} sx={{alignItems:"center"}}>
              <UploadIcon color="action" sx={{ fontSize: "2rem" }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Click to upload lecture video
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported formats: MP4, WebM, MOV (Max 100MB)
              </Typography>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};
