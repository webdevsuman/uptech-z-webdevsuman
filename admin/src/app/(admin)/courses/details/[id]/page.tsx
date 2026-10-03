import { Metadata } from "next";
import CourseDetailsPage from "@/module/courses/pages/CourseDetailsPage";

export const metadata: Metadata = {
  title: "Course Details & Curriculum | UpTech-Z Admin",
  description: "Inspect course curriculum, lecture videos, and moderation status",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <CourseDetailsPage courseId={id} />;
}
