import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

export interface Instructor {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  bio?: string;
  photo_url?: string;
  profilePicture?: string;
  qualification?: string;
  qualifications?: string;
}

export default function CourseInstructor({
  instructor,
}: {
  instructor?: Instructor | null;
}) {
  if (!instructor) return null;

  const avatarSrc = instructor.profilePicture || instructor.photo_url || "";
  const qualificationText = instructor.qualification || instructor.qualifications || "Instructor & Course Author";
  const bioText = instructor.bio || "No biography provided.";

  return (
    <div className="md:px-24 px-5 max-w-7xl mx-auto mt-8">
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Instructor
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
            <Avatar
              src={avatarSrc}
              alt={instructor.name}
              sx={{ width: 72, height: 72, bgcolor: "#5624D0", fontSize: "1.75rem", fontWeight: 700 }}
            >
              {instructor.name.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {instructor.name}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                {qualificationText}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {bioText}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
