"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile, useUpdateProfile } from "@/hooks/react-query/useProfile";
import { useAuth } from "@/context/AuthContext";
import {
  profileSchema,
  ProfileFormData,
} from "@/module/instructor/profile/zod/profile.zod";
import { ProfileAvatarUploader } from "@/module/instructor/profile/components/ProfileAvatarUploader";
import { sToast } from "@/components/ui/alert/stoast";

export default function Profile() {
  const { data: userProfile, isLoading } = useProfile();
  const { setUser } = useAuth();
  const { mutateAsync: updateProfile, isPending: isSaving } =
    useUpdateProfile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      qualification: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name || "",
        qualification: userProfile.qualification || "",
        bio: userProfile.bio || "",
      });
    }
  }, [userProfile, reset]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.qualification)
        formData.append("qualification", data.qualification);
      if (data.bio) formData.append("bio", data.bio);
      if (selectedFile) formData.append("avatar", selectedFile);

      const res = await updateProfile(formData);
      if (res.data) {
        setUser(res.data);
      }
      sToast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      sToast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={40} sx={{ color: "#5624D0" }} />
      </Box>
    );
  }

  if (!userProfile) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="text.secondary">
          No profile information available.
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: 700,
        mx: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: { xs: 2, sm: 4 },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Student Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal profile details and public avatar
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Avatar Uploader & Account Info */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ alignItems: "center", mb: 4 }}
        >
          <ProfileAvatarUploader
            currentImageUrl={userProfile.profilePicture}
            previewUrl={previewUrl}
            name={userProfile.name || "Student"}
            onFileSelect={handleFileSelect}
            onRemovePreview={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
          />
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {userProfile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {userProfile.email}
            </Typography>
            <Chip
              label="Student"
              size="small"
              sx={{ bgcolor: "#5624D0", color: "#fff", fontWeight: 700 }}
            />
          </Box>
        </Stack>

        {/* Profile Edit Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  size="small"
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="qualification"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Headline / Education"
                  placeholder="e.g. Computer Science Student at Tech University"
                  fullWidth
                  size="small"
                  error={Boolean(errors.qualification)}
                  helperText={errors.qualification?.message}
                />
              )}
            />

            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Biography"
                  placeholder="Tell instructors and fellow learners about yourself..."
                  multiline
                  rows={4}
                  fullWidth
                  size="small"
                  error={Boolean(errors.bio)}
                  helperText={errors.bio?.message}
                />
              )}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSaving}
                startIcon={
                  isSaving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  bgcolor: "#5624D0",
                  fontWeight: 700,
                  textTransform: "none",
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#401b9c" },
                }}
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
