"use client";

import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import {
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUser } from "@/typescript/interface/auth.interface";
import { profileSchema, ProfileFormData } from "../zod/profile.zod";
import { useUpdateProfile } from "@/hooks/react-query/useProfile";
import { useAuth } from "@/context/AuthContext";
import { getRoleName } from "@/utils/functions/auth.lib";
import { ProfileAvatarUploader } from "./ProfileAvatarUploader";
import { sToast } from "@/components/ui/alert/stoast";

interface ProfileFormProps {
  user: IUser;
  onSaved?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSaved }) => {
  const { setUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      qualification: user.qualification || "",
      bio: user.bio || "",
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      if (data.qualification?.trim()) {
        formData.append("qualification", data.qualification.trim());
      }
      if (data.bio?.trim()) {
        formData.append("bio", data.bio.trim());
      }
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await updateProfile(formData);
      if (response?.data) {
        const roleName =
          (getRoleName(response.data.role) as IUser["role"]) || "instructor";
        setUser({
          ...response.data,
          role: roleName,
        });
      }
      sToast.success("Profile updated successfully!");
      handleRemovePreview();
      if (onSaved) onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      sToast.error(msg);
    }
  };

  const currentAvatar = user.profilePicture || user.avatar;

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Instructor Profile & Credentials
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          This information will be displayed publicly on your instructor bio and course landing pages.
        </Typography>
      </Box>

      {/* Avatar Section */}
      <ProfileAvatarUploader
        currentImageUrl={currentAvatar}
        previewUrl={previewUrl}
        name={user.name}
        onFileSelect={handleFileSelect}
        onRemovePreview={handleRemovePreview}
      />

      <Divider sx={{ my: 3.5 }} />

      <Stack spacing={3}>
        {/* Full Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Full Name"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          )}
        />

        {/* Email (Read-Only) */}
        <TextField
          fullWidth
          label="Email Address"
          value={user.email || ""}
          disabled
          helperText="Email cannot be changed directly for security reasons."
          slotProps={{
            input: {
              endAdornment: user.isVerified ? (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: "1rem !important" }} />}
                  label="Verified"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              ) : (
                <Chip
                  icon={<CancelIcon sx={{ fontSize: "1rem !important" }} />}
                  label="Unverified"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              ),
            },
          }}
        />

        {/* Professional Headline / Qualification */}
        <Controller
          name="qualification"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Professional Headline / Title"
              placeholder="e.g. Senior Software Architect & Lead Full-Stack Instructor"
              error={Boolean(errors.qualification)}
              helperText={errors.qualification?.message || "Add a quick title like your job or specialty area."}
            />
          )}
        />

        {/* Biography */}
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={5}
              label="Biography"
              placeholder="Tell your students about your experience, industry background, and what you teach..."
              error={Boolean(errors.bio)}
              helperText={errors.bio?.message || "Students read your biography to understand your background and expertise."}
            />
          )}
        />

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{ px: 4, py: 1.25, fontWeight: 700, textTransform: "none" }}
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};
