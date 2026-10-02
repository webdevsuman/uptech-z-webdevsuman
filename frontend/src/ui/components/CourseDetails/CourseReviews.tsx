"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  TextField,
  Button,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export interface Review {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function CourseReviews({ courseId }: { courseId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number | null>(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Current logged in user
  const { user } = useAuth();
  const userId = user?.id ?? null;

  // 🔹 Fetch reviews for this course
  // useEffect(() => {
  //   if (!courseId) return;
  //   const fetchReviews = async () => {
  //     const { data, error } = await supabase
  //       .from("reviews")
  //       .select("*")
  //       .eq("course_id", courseId)
  //       .order("created_at", { ascending: false });
  //     if (!error && data) setReviews(data as Review[]);
  //   };
  //   fetchReviews();
  // }, [courseId]);

  // // 🔹 Submit review
  // const handleSubmit = async () => {
  //   if (!userId) return alert("Login required to leave a review.");
  //   if (!newRating) return alert("Please provide a rating");

  //   setLoading(true);
  //   const { data, error } = await supabase
  //     .from("reviews")
  //     .insert({
  //       user_id: userId,
  //       course_id: courseId,
  //       rating: newRating,
  //       comment: newComment,
  //     })
  //     .select()
  //     .single();

  //   setLoading(false);

  //   if (error) {
  //     console.error("Error adding review:", error.message);
  //   } else if (data) {
  //     setReviews([data as Review, ...reviews]); // optimistic update
  //     setNewRating(0);
  //     setNewComment("");
  //   }
  // };

  return (
    <div className="md:px-30 px-5">
      <Box className="flex flex-col gap-6 border-1 border-gray-400 px-10 pb-5">
        {/* Review submission form */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Leave a Review
            </Typography>
            <Rating
              value={newRating}
              onChange={(_, val) => setNewRating(val)}
              precision={1}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Write your feedback"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Button
              variant="contained"
              // onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </CardContent>
        </Card>

        {/* List of reviews */}
        <Typography className="!font-semibold text-center uppercase">What students say about this course</Typography>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 border-1 border-gray-400">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent>
                <Rating value={r.rating} readOnly />
                <Typography sx={{ mt: 1 }}>{r.comment}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(r.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
          {reviews.length === 0 && (
            <Typography className="!my-5 px-5 italic">No reviews yet. Be the first!</Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}
