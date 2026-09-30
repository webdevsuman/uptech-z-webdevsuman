"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  WishlistItem,
  WishlistRow,
} from "@/typescript/interface/studentSection";
import { getImageUrl } from "@/utils/getImageUrl";
import Swal from "sweetalert2";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      setUserId(user.id);

      // Step 1: fetch wishlist with course info
      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          id,
          courses (
            id,
            title,
            image_path,
            price,
            instructor_id
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching wishlist:", error.message);
        return;
      }

      if (data) {
        const rows = data as unknown as (WishlistRow & { id: string })[];

        const instructorIds = rows.map((w) => w.courses.instructor_id);

        // Step 2: fetch instructors in one go
        const { data: instructors, error: instructorError } = await supabase
          .from("instructors")
          .select("id, name, photo_url")
          .in("id", instructorIds);

        if (instructorError) {
          console.error("Error fetching instructors:", instructorError.message);
          return;
        }

        // Step 3: map rows into wishlist items
        const items: WishlistItem[] = rows.map((w) => {
          const instructor = instructors?.find(
            (ins) => ins.id === w.courses.instructor_id
          );
          return {
            id: w.courses.id,
            title: w.courses.title,
            thumbnail: w.courses.image_path,
            price: w.courses.price,
            instructor: {
              id: instructor?.id ?? "",
              name: instructor?.name ?? "Unknown",
              photo_url: instructor?.photo_url ?? null,
            },
            wishlist_id: w.id, // store wishlist row id for delete
          };
        });

        setWishlist(items);

        // Step 4: fetch enrolled courses
        const { data: enrollments, error: enrollError } = await supabase
          .from("enrollments")
          .select("course_id")
          .eq("user_id", user.id);

        if (!enrollError && enrollments) {
          setEnrolledCourses(enrollments.map((e) => e.course_id));
        }
      }
    };

    fetchWishlist();
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!userId) return alert("Login required");

    const { error } = await supabase.from("enrollments").insert({
      user_id: userId,
      course_id: courseId,
    });

    if (!error) {
      setEnrolledCourses((prev) => [...prev, courseId]);
      // alert("Successfully Enrolled 🎉");
      Swal.fire("Successfully Enrolled 🎉");
    } else {
      console.error(error.message);
    }
  };

  const handleRemove = async (wishlistId: string) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishlistId);

    if (!error) {
      setWishlist((prev) => prev.filter((w) => w.wishlist_id !== wishlistId));
      // alert("Removed from Wishlist ❌");
      Swal.fire("Removed from Wishlist ❌");
    } else {
      console.error(error.message);
    }
  };

  return (
    <Box className="grid grid-cols-3 gap-6">
      {wishlist.map((item) => (
        <Card elevation={4} key={item.id}>
          <CardMedia
            component="img"
            height="140"
            image={getImageUrl(item.thumbnail)}
            alt={item.title}
          />
          <CardContent>
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.instructor.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              ₹{item.price}
            </Typography>

            {/* Actions */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Tooltip title="Remove from Wishlist">
                <IconButton
                  color="error"
                  onClick={() => handleRemove(item.wishlist_id!)}
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>

              {enrolledCourses.includes(item.id) ? (
                <Button variant="contained" disabled>
                  Enrolled
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleEnroll(item.id)}
                >
                  Enroll
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}

      {wishlist.length === 0 && (
        <Typography
          variant="body1"
          sx={{ gridColumn: "1/-1", textAlign: "center" }}
        >
          Your wishlist is empty.
        </Typography>
      )}
    </Box>
  );
}
