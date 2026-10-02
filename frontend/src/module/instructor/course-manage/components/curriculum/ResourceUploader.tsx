"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  AttachFile as FileIcon,
  DeleteOutlined as DeleteIcon,
  Add as AddIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { ILecture } from "@/typescript/interface/course.interface";
import {
  useAddLectureResource,
  useDeleteLectureResource,
} from "@/hooks/react-query/useCurriculum";
import { sToast } from "@/components/ui/alert/stoast";

interface ResourceUploaderProps {
  courseId: string;
  sectionId: string;
  lecture: ILecture;
}

export const ResourceUploader: React.FC<ResourceUploaderProps> = ({
  courseId,
  sectionId,
  lecture,
}) => {
  const lectureId = lecture._id || lecture.id || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resourceTitle, setResourceTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: addResource } = useAddLectureResource(courseId);
  const { mutateAsync: deleteResource } = useDeleteLectureResource(courseId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!resourceTitle) {
        setResourceTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", resourceTitle.trim() || selectedFile.name);

    try {
      setIsUploading(true);
      await addResource({ sectionId, lectureId, formData });
      sToast.success("Course material attached successfully!");
      setSelectedFile(null);
      setResourceTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload material";
      sToast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await deleteResource({ sectionId, lectureId, resourceId });
      sToast.info("Material removed");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to remove material";
      sToast.error(msg);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const resources = lecture.resources || [];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: "text.secondary",
          textTransform: "uppercase",
        }}
      >
        Downloadable Materials ({resources.length})
      </Typography>

      {/* Existing Resources List */}
      {resources.length > 0 && (
        <List
          disablePadding
          sx={{
            mt: 1,
            mb: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
          }}
        >
          {resources.map((resItem) => {
            const resId = resItem._id || resItem.id || "";
            const isPdf = resItem.fileType?.toLowerCase() === "pdf";
            return (
              <ListItem
                key={resId}
                divider
                secondaryAction={
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      component="a"
                      href={resItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      title="Download"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(resId)}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {isPdf ? (
                    <PdfIcon sx={{ color: "error.main", fontSize: "1.2rem" }} />
                  ) : (
                    <FileIcon
                      sx={{ color: "primary.main", fontSize: "1.2rem" }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                      {resItem.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {`${resItem.fileType?.toUpperCase() || "FILE"} • ${formatFileSize(resItem.fileSize)}`}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}

      {/* Upload New Resource Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {selectedFile ? (
        <Stack
          spacing={1.5}
          sx={{
            p: 1.5,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            mt: 1,
          }}
        >
          <TextField
            size="small"
            fullWidth
            label="Resource Title"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button
              size="small"
              variant="text"
              color="inherit"
              disabled={isUploading}
              onClick={() => {
                setSelectedFile(null);
                setResourceTitle("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={isUploading}
              onClick={handleUpload}
              startIcon={
                isUploading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
            >
              {isUploading ? "Uploading..." : "Save Material"}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<AddIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ mt: 1, textTransform: "none", fontSize: "0.8rem" }}
        >
          Add PDF or Lecture Attachment
        </Button>
      )}
    </Box>
  );
};
