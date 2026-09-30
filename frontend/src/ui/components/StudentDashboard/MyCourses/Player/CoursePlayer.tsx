"use client";

import { useRef, useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Stack } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  courseId: string;
  userId: string | undefined;
  onProgressUpdate?: (progress: number) => void; // callback for parent
}

interface VideoMeta {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

export default function CoursePlayer({
  courseId,
  userId,
  onProgressUpdate,
}: Props) {
  const [progress, setProgress] = useState<number>(0);
  const [lastTime, setLastTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videos, setVideos] = useState<VideoMeta[]>([]);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load available videos
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("course_videos_meta")
        .select("id, file_name, file_path, created_at")
        .eq("course_id", courseId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching videos:", error.message);
        setVideos([]);
        setLoading(false);
        return;
      }

      setVideos(data ?? []);

      if (data && data.length > 0) {
        // Get signed URL for the first video
        const { data: urlData, error: urlError } = await supabase.storage
          .from("course-videos")
          .createSignedUrl(data[0].file_path, 60 * 60); // 1 hr

        if (urlError) console.error("Signed URL error:", urlError.message);
        else setSignedUrl(urlData?.signedUrl ?? null);
      }

      setLoading(false);
    };

    fetchVideos();
  }, [courseId]);

  // 🔹 Load saved progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("course_progress")
        .select("progress, last_time")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (!error && data) {
        setProgress(data.progress);
        setLastTime(data.last_time);
      }
    };
    fetchProgress();
  }, [userId, courseId]);

  // 🔹 Resume from last saved time
  useEffect(() => {
    const video = videoRef.current;
    if (video && lastTime > 0) {
      video.currentTime = lastTime;
    }
  }, [lastTime, signedUrl]);

  // 🔹 Save progress periodically
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !userId) return;

    let saveTimer: NodeJS.Timeout;

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(Math.round(currentProgress));

        clearTimeout(saveTimer);
        saveTimer = setTimeout(async () => {
          // Save per-video progress
          const { error } = await supabase.from("course_progress").upsert(
            {
              user_id: userId,
              course_id: courseId as string,
              progress: currentProgress,
              last_time: video.currentTime,
            },
            { onConflict: "user_id,course_id" }
          );
          console.log("Progress course id:",courseId);
          
          if (error) console.error("Error saving progress:", error.message);

          // 🔹 Also update overall course progress in enrollments
          const { error: enrollError } = await supabase
            .from("enrollments")
            .update({ progress: currentProgress })
            .eq("user_id", userId)
            .eq("course_id", courseId);

          if (enrollError)
            console.error("Error updating enrollment:", enrollError.message);

          // Update parent
          if (onProgressUpdate) {
            onProgressUpdate(Math.round(currentProgress));
          }
        }, 5000);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      clearTimeout(saveTimer);
    };
  }, [userId, courseId, onProgressUpdate, signedUrl]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Course Player
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : !signedUrl ? (
        <Typography>No videos uploaded yet for this course.</Typography>
      ) : (
        <video
          ref={videoRef}
          controls
          width="100%"
          height="480px"
          src={signedUrl}
        />
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Typography variant="body2">Progress: {progress}%</Typography>
      </Stack>
    </Box>
  );
}
