"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  Divider,
} from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import CourseReviews from "./CourseReviews";
import CourseQnA from "./QnA/CourseQnA";

interface CourseCommunityTabsProps {
  courseId: string;
  isEnrolled: boolean;
  isInstructor: boolean;
  onEnroll?: () => void;
}

export default function CourseCommunityTabs({
  courseId,
  isEnrolled,
  isInstructor,
  onEnroll,
}: CourseCommunityTabsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="md:px-24 px-5 max-w-7xl mx-auto my-8">
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Two Tabs: Reviews & QnA */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  minHeight: 48,
                  gap: 1,
                  color: "#4b5563",
                  "&.Mui-selected": {
                    color: "#5624D0",
                  },
                },
                "& .MuiTabs-indicator": {
                  bgcolor: "#5624D0",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab
                icon={<StarOutlineIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Student Reviews & Ratings"
              />
              <Tab
                icon={<QuestionAnswerOutlinedIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Questions & Answers (Q&A)"
              />
            </Tabs>
          </Box>

          {/* Tab 0: Student Reviews */}
          {activeTab === 0 && (
            <CourseReviews courseId={courseId} embedded={true} />
          )}

          {/* Tab 1: Course Q&A */}
          {activeTab === 1 && (
            <CourseQnA
              courseId={courseId}
              isEnrolled={isEnrolled}
              isInstructor={isInstructor}
              onEnroll={onEnroll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
