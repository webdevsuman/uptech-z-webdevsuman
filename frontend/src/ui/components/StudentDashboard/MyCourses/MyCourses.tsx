"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CourseSummary,
  EnrollmentWithCourse,
} from "@/typescript/interface/studentSection";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  LinearProgress,
  Dialog,
} from "@mui/material";
import CoursePlayer from "./Player/CoursePlayer";
import { getImageUrl } from "@/utils/getImageUrl";
import { useAuth } from "@/context/AuthContext";

export default function MyCourses() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [activeCourse, setActiveCourse] = useState<CourseSummary | null>(null);
  const { user } = useAuth();
  const userId = user?.id;

  const fetchCourses = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("enrollments")
      .select("progress, course_id, courses(id, title, image_path)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching courses:", error.message);
      return;
    }

    if (data) {
      setCourses(
        (data as unknown as EnrollmentWithCourse[])?.map((e) => ({
          id: e.courses.id,
          title: e.courses.title,
          thumbnail: e.courses.image_path,
          progress: e.progress ?? 0,
        }))
      );
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [userId]);

  // 🔹 Listen for realtime changes
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("enrollment-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "enrollments",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as {
            course_id: string;
            progress: number;
          };
          setCourses((prev) =>
            prev.map((c) =>
              c.id === updated.course_id
                ? { ...c, progress: updated.progress }
                : c
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <Box className="grid grid-cols-3 gap-6">
      {courses.map((c) => (
        <Card elevation={4} key={c.id} onClick={() => setActiveCourse(c)}>
          <CardMedia
            component="img"
            height="140"
            image={getImageUrl(c.thumbnail)}
          />
          <CardContent>
            <Typography variant="h6">{c.title}</Typography>
            <LinearProgress value={c.progress} variant="determinate" />
            <Typography variant="body2">{c.progress.toFixed(0)}%</Typography>
          </CardContent>
        </Card>
      ))}

      {/* Course Player in Dialog */}
      <Dialog
        open={!!activeCourse}
        onClose={() => setActiveCourse(null)}
        fullWidth
        maxWidth="lg"
      >
        {activeCourse && (
          <CoursePlayer
            courseId={activeCourse.id}
            userId={userId}
            onProgressUpdate={(p) => {
              // update local state instantly
              setCourses((prev) =>
                prev.map((course) =>
                  course.id === activeCourse.id
                    ? { ...course, progress: p }
                    : course
                )
              );
            }}
          />
        )}
      </Dialog>
    </Box>
  );
}
