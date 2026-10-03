import { Metadata } from "next";
import CoursesListPage from "@/module/courses/pages/CoursesListPage";

export const metadata: Metadata = {
  title: "Course Management | UpTech-Z Admin",
  description: "Review, approve, and manage platform courses and curriculum",
};

export default function Page() {
  return <CoursesListPage />;
}
