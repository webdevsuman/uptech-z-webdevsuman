import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  photo_url?: string;
  qualifications: string;
}

export default function CourseInstructor({
  instructor,
}: {
  instructor: Instructor;
}) {
  // console.log("Course Instructor:", instructor);

  return (
    <div className="md:px-30 px-5">
      <Card elevation={4} sx={{ mt: 4, p: 4 }}>
        <CardContent className="grid grid-cols-5 border-1 border-gray-500 items-center !px-10">
          <Typography className="col-span-1" variant="h6">
            Instructor
          </Typography>
          <Box
            className="col-span-4"
            sx={{ display: "flex", alignItems: "center", mt: 2, gap: "15px" }}
          >
            <Avatar
              src={instructor.photo_url || ""}
              alt={instructor.name}
              sx={{ mr: 2, width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="h6" className="!font-bold">
                {instructor.name}
              </Typography>
              <Typography variant="body1">{instructor.bio}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
