"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Stack,
  Dialog,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ISection, ILecture } from "@/typescript/interface/course.interface";
import CoursePlayer from "@/ui/components/StudentDashboard/MyCourses/Player/CoursePlayer";
import { sToast } from "@/components/ui/alert/stoast";

interface CourseSyllabusProps {
  courseId?: string;
  sections?: ISection[];
  enrolled?: boolean;
  isInstructor?: boolean;
}

export default function CourseSyllabus({
  courseId,
  sections = [],
  enrolled = false,
  isInstructor = false,
}: CourseSyllabusProps) {
  const [expanded, setExpanded] = useState<string | false>("panel-0");
  const [playingLectureId, setPlayingLectureId] = useState<string | null>(null);

  const handleChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const totalLectures = sections.reduce(
    (acc, s) => acc + (s.lectures?.length || 0),
    0
  );

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLectureClick = (lecture: ILecture) => {
    const isAccessible = enrolled || isInstructor || lecture.isPreview;
    if (!isAccessible) {
      sToast.info("Please enroll in this course to watch this lecture and access materials.");
      return;
    }
    if (!courseId) {
      sToast.error("Course information missing");
      return;
    }
    setPlayingLectureId(lecture._id || lecture.id || null);
  };

  return (
    <div className="md:px-24 px-5 max-w-7xl mx-auto mt-8">
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Course Content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sections.length} {sections.length === 1 ? "section" : "sections"} • {totalLectures} lectures
            </Typography>
          </Box>

          {!sections.length ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
              Curriculum is currently being updated by the instructor.
            </Typography>
          ) : (
            <div className="space-y-2">
              {sections.map((section, sIdx) => {
                const panelId = `panel-${sIdx}`;
                const lectures = section.lectures || [];

                return (
                  <Accordion
                    key={section._id || section.id || sIdx}
                    expanded={expanded === panelId}
                    onChange={handleChange(panelId)}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "8px !important",
                      "&:before": { display: "none" },
                      boxShadow: "none",
                      overflow: "hidden",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ bgcolor: "background.default", px: 2.5 }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", pr: 2, alignItems: "center" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Section {sIdx + 1}: {section.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
                        </Typography>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 0 }}>
                      <div className="divide-y divide-gray-100">
                        {lectures.map((lecture, lIdx) => {
                          const isAccessible = enrolled || isInstructor || lecture.isPreview;
                          const hasVideo = Boolean(lecture.video?.url);
                          const hasResources = Boolean(lecture.resources && lecture.resources.length > 0);

                          return (
                            <Box
                              key={lecture._id || lecture.id || lIdx}
                              onClick={() => handleLectureClick(lecture)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 1.5,
                                pl: 3,
                                pr: 2,
                                cursor: isAccessible ? "pointer" : "default",
                                transition: "all 0.15s",
                                "&:hover": {
                                  bgcolor: isAccessible ? "rgba(86,36,208,0.04)" : "transparent",
                                },
                              }}
                            >
                              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                {isAccessible ? (
                                  hasVideo ? (
                                    <PlayCircleOutlineIcon sx={{ fontSize: 20, color: "primary.main" }} />
                                  ) : (
                                    <DescriptionOutlinedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                                  )
                                ) : (
                                  <LockOutlinedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                                )}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: isAccessible ? 600 : 400,
                                    color: isAccessible ? "text.primary" : "text.secondary",
                                  }}
                                >
                                  {lecture.title}
                                </Typography>
                              </Stack>

                              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                                {lecture.isPreview && !enrolled && (
                                  <Chip
                                    label="Free Preview"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700 }}
                                  />
                                )}
                                {hasResources && (
                                  <Tooltip title={`${lecture.resources?.length} attached resource(s)`}>
                                    <Chip
                                      label={`${lecture.resources?.length} PDF`}
                                      size="small"
                                      sx={{ height: 20, fontSize: "0.65rem", bgcolor: "grey.100" }}
                                    />
                                  </Tooltip>
                                )}
                                {lecture.video?.duration && (
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDuration(lecture.video.duration)}
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          );
                        })}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Video & Resource Player Modal */}
      {courseId && (
        <Dialog
          open={Boolean(playingLectureId)}
          onClose={() => setPlayingLectureId(null)}
          maxWidth="lg"
          fullWidth
          slotProps={{
            paper: {
              sx: { bgcolor: "#0f1117", borderRadius: 3, overflow: "hidden" },
            },
          }}
        >
          <CoursePlayer
            courseId={courseId}
            initialLectureId={playingLectureId || undefined}
            onClose={() => setPlayingLectureId(null)}
          />
        </Dialog>
      )}
    </div>
  );
}
