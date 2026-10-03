"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { useCourse } from "@/hooks/react-query/useCourse";
import { ILecture } from "@/typescript/interface/course.interface";

interface CoursePlayerProps {
  courseId: string;
  initialLectureId?: string;
  onClose?: () => void;
}

export default function CoursePlayer({
  courseId,
  initialLectureId,
  onClose,
}: CoursePlayerProps) {
  const { data: course, isLoading, isError } = useCourse(courseId);

  // Flatten all lectures with their section index and lecture index
  const allLectures = useMemo(() => {
    if (!course?.sections) return [];
    const flat: (ILecture & { sectionTitle: string })[] = [];
    course.sections.forEach((section) => {
      section.lectures?.forEach((lec) => {
        flat.push({ ...lec, sectionTitle: section.title });
      });
    });
    return flat;
  }, [course]);

  // Current active lecture state
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialLectureId
  );

  const activeLecture = useMemo(() => {
    if (!allLectures.length) return null;
    if (selectedId) {
      const found = allLectures.find(
        (l) => (l._id || l.id) === selectedId
      );
      if (found) return found;
    }
    return allLectures[0];
  }, [allLectures, selectedId]);

  const activeIndex = useMemo(() => {
    if (!activeLecture) return -1;
    return allLectures.findIndex(
      (l) => (l._id || l.id) === (activeLecture._id || activeLecture.id)
    );
  }, [allLectures, activeLecture]);

  const handleNext = () => {
    if (activeIndex >= 0 && activeIndex < allLectures.length - 1) {
      const nextLec = allLectures[activeIndex + 1];
      setSelectedId(nextLec._id || nextLec.id);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevLec = allLectures[activeIndex - 1];
      setSelectedId(prevLec._id || prevLec.id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress size={48} sx={{ color: "#5624D0" }} />
      </Box>
    );
  }

  if (isError || !course) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">Failed to load course video player.</Typography>
      </Box>
    );
  }

  const videoUrl = activeLecture?.video?.url;
  const resources = activeLecture?.resources || [];

  return (
    <Box sx={{ bgcolor: "#0f1117", color: "#fff", borderRadius: 2, overflow: "hidden" }}>
      {/* Top Header Bar */}
      <Box
        sx={{
          p: 2,
          px: 3,
          bgcolor: "#1a1d26",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{ maxWidth: "80%" }}>
          <Typography variant="caption" sx={{ color: "#a435f0", fontWeight: 700, textTransform: "uppercase" }}>
            {course.title}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
            {activeLecture?.title || "Course Lecture"}
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff" } }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Main Grid: Video Stage + Curriculum List */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2.4fr 1fr" }, minHeight: 480 }}>
        {/* Left Side: Video Player & PDF Resources */}
        <Box sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", bgcolor: "#050608" }}>
          {videoUrl ? (
            <Box sx={{ position: "relative", width: "100%", pt: "56.25%", bgcolor: "#000", borderRadius: 2, overflow: "hidden" }}>
              <video
                key={videoUrl}
                controls
                autoPlay
                playsInline
                src={videoUrl}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                minHeight: 320,
                bgcolor: "#12141c",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                textAlign: "center",
              }}
            >
              <OndemandVideoIcon sx={{ fontSize: 56, color: "rgba(255,255,255,0.3)", mb: 1.5 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                No video attached to this lecture
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", maxWidth: 400 }}>
                This lecture is text-based or contains downloadable resource materials below.
              </Typography>
            </Box>
          )}

          {/* Navigation Controls */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<NavigateBeforeIcon />}
              onClick={handlePrev}
              disabled={activeIndex <= 0}
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
            >
              Previous
            </Button>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Lecture {activeIndex + 1} of {allLectures.length}
            </Typography>
            <Button
              variant="contained"
              size="small"
              endIcon={<NavigateNextIcon />}
              onClick={handleNext}
              disabled={activeIndex >= allLectures.length - 1}
              sx={{ bgcolor: "#5624D0", fontWeight: 700, "&:hover": { bgcolor: "#401b9c" } }}
            >
              Next Lecture
            </Button>
          </Box>

          {/* Lecture Attached Resources / PDFs */}
          {resources.length > 0 && (
            <Box sx={{ mt: 3, p: 2.5, bgcolor: "#151821", borderRadius: 2, border: "1px solid rgba(255,255,255,0.08)" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#fff" }}>
                Lecture Materials & Documents ({resources.length})
              </Typography>
              <Stack spacing={1.5}>
                {resources.map((res, rIdx) => (
                  <Box
                    key={res._id || res.id || rIdx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      bgcolor: "rgba(255,255,255,0.03)",
                      borderRadius: 1.5,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <PictureAsPdfIcon sx={{ color: "#e11d48", fontSize: 24 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>
                          {res.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                          {res.fileType?.toUpperCase() || "PDF / DOCUMENT"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "#38bdf8", borderColor: "rgba(56,189,248,0.4)", textTransform: "none", fontWeight: 600 }}
                    >
                      View / Download
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {activeLecture?.description && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "rgba(255,255,255,0.03)", borderRadius: 1.5 }}>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", display: "block", mb: 0.5, fontWeight: 700 }}>
                LECTURE NOTES
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
                {activeLecture.description}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Side: Course Curriculum Playlist */}
        <Box sx={{ bgcolor: "#12141c", borderLeft: "1px solid rgba(255,255,255,0.08)", p: 2, maxHeight: 600, overflowY: "auto" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: "#fff", px: 1 }}>
            Course Curriculum ({allLectures.length})
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2 }} />

          <Stack spacing={1}>
            {allLectures.map((lec, idx) => {
              const lecId = lec._id || lec.id;
              const isSelected = (activeLecture?._id || activeLecture?.id) === lecId;

              return (
                <Box
                  key={lecId || idx}
                  onClick={() => setSelectedId(lecId)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: isSelected ? "rgba(86,36,208,0.25)" : "transparent",
                    border: "1px solid",
                    borderColor: isSelected ? "#5624D0" : "transparent",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                    transition: "all 0.15s",
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                    <PlayCircleFilledIcon sx={{ color: isSelected ? "#a435f0" : "rgba(255,255,255,0.4)", fontSize: 20, mt: 0.2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? "#fff" : "rgba(255,255,255,0.8)" }}>
                        {idx + 1}. {lec.title}
                      </Typography>
                      {lec.resources && lec.resources.length > 0 && (
                        <Chip label={`${lec.resources.length} resource`} size="small" sx={{ height: 18, fontSize: "0.65rem", mt: 0.5, bgcolor: "rgba(255,255,255,0.1)", color: "#93c5fd" }} />
                      )}
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
