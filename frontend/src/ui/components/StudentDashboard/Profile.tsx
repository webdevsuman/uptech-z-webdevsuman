"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import Swal from "sweetalert2";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  role?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

//   console.log("User Profile:",profile);
  

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
    //   console.log("Data of user:",data);
      
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      if (data?.user) {
        const user = data.user;
        setProfile({
          id: user.id,
          email: user.email ?? "",
          name: user.user_metadata?.display_name ?? "",
          avatar_url: user.user_metadata?.avatar_url ?? "",
          bio: user.user_metadata?.bio ?? "",
          role: user.user_metadata?.role ?? "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: profile.name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
      },
    });

    if (error) {
      // alert("Failed to update profile: " + error.message);
      Swal.fire({
        title: "Failed to update profile",
        text: error.message,
        icon: "error",
      });
    } else {
      // alert("Profile updated!");
      Swal.fire("Profile updated!");

    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!profile) return <Typography>No profile found</Typography>;

  return (
    <Box
      className="border-1 border-gray-400 p-5 rounded-2xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        alignItems: "center",
      }}
    >
      <Avatar src={profile.avatar_url} sx={{ width: 80, height: 80 }} />
      <Typography variant="body2">Email: {profile.email}</Typography>

      <TextField
        label="Name"
        value={profile.name ?? ""}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />
      <TextField
        label="Bio"
        value={profile.bio ?? ""}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
      />

      <Button onClick={handleSave} variant="contained">
        Save
      </Button>
    </Box>
  );
}
