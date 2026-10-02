"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  FormHelperText,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseLandingPageSchema,
  CourseLandingPageFormData,
} from "../zod/courseLandingPage.zod";
import { ICourse } from "@/typescript/interface/course.interface";
import { useCategories } from "@/hooks/react-query/useCategories";
import { useUpdateCourse } from "@/hooks/react-query/useUpdateCourse";
import { getImageUrl } from "@/utils/getImageUrl";
import { allowedImageTypes, MAX_IMAGE_SIZE } from "@/config/constants";
import { sToast } from "@/components/ui/alert/stoast";

interface CourseLandingPageFormProps {
  course: ICourse;
  onSaved?: () => void;
  onProceedToPricing?: () => void;
  onProceedToCurriculum?: () => void;
}

const LANGUAGES = [
  "English",
  "Spanish",
  "Hindi",
  "German",
  "French",
  "Portuguese",
  "Japanese",
  "Chinese",
  "Arabic",
];

const LEVELS = [
  { value: "all_levels", label: "All Levels" },
  { value: "beginner", label: "Beginner Level" },
  { value: "intermediate", label: "Intermediate Level" },
  { value: "advanced", label: "Advanced Level" },
];

export const CourseLandingPageForm: React.FC<CourseLandingPageFormProps> = ({
  course,
  onSaved,
  onProceedToPricing,
  onProceedToCurriculum,
}) => {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { mutateAsync: updateCourse, isPending: isSaving } = useUpdateCourse(
    course._id || course.id || ""
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialCategoryId =
    typeof course.category === "object" && course.category !== null
      ? course.category._id
      : typeof course.category === "string"
      ? course.category
      : "";

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<CourseLandingPageFormData>({
    resolver: zodResolver(courseLandingPageSchema),
    defaultValues: {
      title: course.title || "",
      subtitle: course.subtitle || "",
      description: course.description || "",
      category: initialCategoryId,
      level: (course.level?.toLowerCase() as CourseLandingPageFormData["level"]) || "all_levels",
      language: course.language || "English",
    },
  });

  const subtitleValue = watch("subtitle") || "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      setFileError("Invalid image format. Allowed: JPG, PNG, WEBP, SVG.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFileError("Image size exceeds the 5MB limit.");
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveLandingPage = async (
    data: CourseLandingPageFormData,
    proceedToPricing: boolean = false
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title.trim());
      if (data.subtitle?.trim()) formData.append("subtitle", data.subtitle.trim());
      if (data.description?.trim()) formData.append("description", data.description.trim());
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("language", data.language);

      if (selectedFile) {
        formData.append("thumbnail", selectedFile);
      }

      await updateCourse(formData);
      sToast.success("Course landing page saved successfully!");
      if (onSaved) onSaved();
      if (proceedToPricing) {
        if (onProceedToCurriculum) {
          onProceedToCurriculum();
        } else if (onProceedToPricing) {
          onProceedToPricing();
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update course details";
      sToast.error(message);
    }
  };

  const hasExistingThumbnail =
    (typeof course.thumbnail === "string" && course.thumbnail.trim().length > 0) ||
    (typeof course.thumbnail === "object" && Boolean(course.thumbnail?.url?.trim()));

  const currentDisplayImage = previewUrl || (hasExistingThumbnail ? getImageUrl(course.thumbnail) : null);

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit((data) => handleSaveLandingPage(data, false))}
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
          Course Landing Page
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Your course landing page is crucial to your success on the platform. Keep it
          engaging and accurate.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Course Title"
              error={Boolean(errors.title)}
              helperText={errors.title?.message || "Your title should be catching and informative."}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {100 - (field.value?.length || 0)}
                    </Typography>
                  ),
                },
              }}
            />
          )}
        />

        {/* Subtitle */}
        <Controller
          name="subtitle"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Course Subtitle"
              placeholder="e.g. Master the core fundamentals and build production-grade web applications"
              error={Boolean(errors.subtitle)}
              helperText={
                errors.subtitle?.message ||
                "Use 1 or 2 sentences to hook students and summarize what they will learn."
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {160 - subtitleValue.length}
                    </Typography>
                  ),
                },
              }}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={5}
              label="Course Description"
              placeholder="Provide a comprehensive summary of what your course covers, who it is for, and key topics..."
              error={Boolean(errors.description)}
              helperText={
                errors.description?.message ||
                "Description should have at least 20 characters explaining course outcomes."
              }
            />
          )}
        />

        {/* Basic Info: Language, Level, Category */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, pt: 1 }}>
          Basic Info
        </Typography>

        <Grid container spacing={2}>
          {/* Language */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Language"
                  error={Boolean(errors.language)}
                  helperText={errors.language?.message}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Level */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Level"
                  error={Boolean(errors.level)}
                  helperText={errors.level?.message}
                >
                  {LEVELS.map((lvl) => (
                    <MenuItem key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Category"
                  disabled={isCategoriesLoading}
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                >
                  <MenuItem value="" disabled>
                    <em>Choose a category</em>
                  </MenuItem>
                  {categories?.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>

        {/* Course Thumbnail Image */}
        <Box sx={{ pt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Course Image
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Upload your course image here. Max size: 5MB. Formats: JPG, PNG, WEBP, SVG.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
            {/* Image Preview Box */}
            <Box
              sx={{
                width: 240,
                height: 135,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px dashed",
                borderColor: "divider",
                bgcolor: "action.hover",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
                textAlign: "center",
              }}
            >
              {currentDisplayImage ? (
                <Image
                  src={currentDisplayImage}
                  alt="Course Thumbnail"
                  fill
                  sizes="240px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: "2rem", color: "text.disabled", mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                    No thumbnail uploaded
                  </Typography>
                </>
              )}
            </Box>

            {/* Upload Controls */}
            <Stack spacing={1.5}>
              <input
                ref={fileInputRef}
                type="file"
                accept={allowedImageTypes.join(",")}
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="course-thumbnail-upload"
              />
              <Stack direction="row" spacing={1.5}>
                <label htmlFor="course-thumbnail-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    {previewUrl ? "Change Image" : "Upload File"}
                  </Button>
                </label>

                {previewUrl && (
                  <Button
                    variant="text"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemoveSelectedFile}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Remove
                  </Button>
                )}
              </Stack>

              {fileError && (
                <FormHelperText error sx={{ mt: 0.5 }}>
                  {fileError}
                </FormHelperText>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Form Action Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            color="primary"
            disabled={isSaving}
            onClick={handleSubmit((data) => handleSaveLandingPage(data, false))}
            sx={{ px: 3, py: 1, fontWeight: 600, textTransform: "none" }}
          >
            {isSaving ? "Saving..." : "Save Landing Page"}
          </Button>

          {(onProceedToCurriculum || onProceedToPricing) && (
            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={isSaving}
              onClick={handleSubmit((data) => handleSaveLandingPage(data, true))}
              endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
              sx={{ px: 3.5, py: 1, fontWeight: 700, textTransform: "none" }}
            >
              {onProceedToCurriculum
                ? "Save & Continue to Curriculum"
                : "Save & Continue to Pricing"}
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};
