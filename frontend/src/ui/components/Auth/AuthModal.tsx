"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

export default function AuthModal({
  open,
  onClose,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");

  // Extra fields
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    let photoUrl: string | null = null;

    // If instructor uploaded photo → upload to bucket
    if (photoFile) {
      const filePath = `avatars/${Date.now()}_${photoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, photoFile);

      if (uploadError) {
        console.error("Photo upload failed:", uploadError.message);
        Swal.fire({
          title: "Failed to upload photo",
          text: uploadError.message,
          icon: "error",
        });
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        photoUrl = publicUrlData.publicUrl;
      }
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            display_name: displayName,
            bio: role === "instructor" ? bio : null,
            qualifications: role === "instructor" ? qualifications : null,
            photo_url: role === "instructor" ? photoUrl : null,
          },
        },
      });

      if (error) console.error(error);
      console.log("Sign up message:", data);
      Swal.fire("Successfully signed up!");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) console.error(error);
      // console.log("Sign in message:", data);
      Swal.fire("Sign in Successful!");
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="!font-semibold text-gray-500 uppercase text-center">
        {mode === "signup" ? "Join us" : "Welcome back"}
      </DialogTitle>
      <DialogContent
        className="!pt-2"
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Only show role selection + extra fields on signup */}
        {mode === "signup" && (
          <>
            <RadioGroup
              row
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "student" | "instructor")
              }
            >
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Student"
              />
              <FormControlLabel
                value="instructor"
                control={<Radio />}
                label="Instructor"
              />
            </RadioGroup>

            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            {role === "instructor" && (
              <>
                <TextField
                  label="Bio"
                  multiline
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <TextField
                  label="Qualifications"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
                <Button variant="outlined" component="label">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  />
                </Button>
              </>
            )}
          </>
        )}

        <Button variant="contained" onClick={handleSubmit}>
          {mode === "signup" ? "Create Account" : "Login"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
