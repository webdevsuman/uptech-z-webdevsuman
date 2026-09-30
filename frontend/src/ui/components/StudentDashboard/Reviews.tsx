"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Card,
  CardContent,
  Rating,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";

interface Review {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  course?: { title: string };
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      // get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // fetch reviews by this user
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          course_id,
          user_id,
          rating,
          comment,
          created_at,
          course:courses(title)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setReviews(data as unknown as Review[]);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // console.log("Reviews:", reviews);

  if (loading) return <Typography>Loading...</Typography>;

  if (reviews.length === 0)
    return <Typography>You have not reviewed any courses yet.</Typography>;

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reviews.map((r) => (
        <Card className="px-5" elevation={4} key={r.id}>
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              alignItems="center" justifyItems="center"
              sx={{ mb: 1 }}
            >
              <Avatar>{r.user_id[0]?.toUpperCase()}</Avatar>
              <Box className="flex flex-col items-center text-center gap-2">
                <Typography variant="subtitle1">
                  {r.course?.title || `Course ID: ${r.course_id}`}
                </Typography>
                <Rating value={r.rating} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  {new Date(r.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="h6" className="text-center italic">
              <q>
              {r.comment}</q></Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
