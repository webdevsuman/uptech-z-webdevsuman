"use client";

import React, { useRef } from "react";
import { Box, Avatar, Button, Stack, Typography, FormHelperText } from "@mui/material";
import { CloudUpload as UploadIcon, DeleteOutlined as DeleteIcon } from "@mui/icons-material";
import { allowedImageTypes, MAX_IMAGE_SIZE } from "@/config/constants";
import { sToast } from "@/components/ui/alert/stoast";

interface ProfileAvatarUploaderProps {
  currentImageUrl?: string;
  previewUrl: string | null;
  name: string;
  error?: string | null;
  onFileSelect: (file: File) => void;
  onRemovePreview: () => void;
}

export const ProfileAvatarUploader: React.FC<ProfileAvatarUploaderProps> = ({
  currentImageUrl,
  previewUrl,
  name,
  error,
  onFileSelect,
  onRemovePreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      sToast.error("Invalid image format. Allowed: PNG, JPG, JPEG, WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      sToast.error("Image size exceeds 5MB limit.");
      return;
    }

    onFileSelect(file);
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{alignItems:"center"}}>
      <input
        type="file"
        ref={fileInputRef}
        accept={allowedImageTypes.join(",")}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Avatar
        src={displayImage || undefined}
        alt={name}
        sx={{
          width: 104,
          height: 104,
          fontSize: "2.5rem",
          fontWeight: 700,
          bgcolor: "primary.main",
          border: "3px solid",
          borderColor: "background.paper",
          boxShadow: 2,
        }}
      >
        {name ? name.charAt(0).toUpperCase() : "U"}
      </Avatar>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Profile Photo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Upload a clear headshot. Allowed: JPG, PNG, WEBP. Max 5MB.
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {displayImage ? "Change Photo" : "Upload Photo"}
          </Button>

          {previewUrl && (
            <Button
              size="small"
              color="error"
              variant="text"
              startIcon={<DeleteIcon />}
              onClick={() => {
                onRemovePreview();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          )}
        </Stack>

        {error && <FormHelperText error>{error}</FormHelperText>}
      </Stack>
    </Stack>
  );
};
