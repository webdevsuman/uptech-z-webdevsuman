import { Metadata } from "next";
import CategoryAddPage from "@/module/category/pages/CategoryAddPage";

export const metadata: Metadata = {
  title: "Add Category | UpTech-Z Admin",
  description: "Create a new course category in UpTech-Z LMS",
};

export default function Page() {
  return <CategoryAddPage />;
}
