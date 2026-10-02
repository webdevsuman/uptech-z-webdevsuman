import { Metadata } from "next";
import CategoryListPage from "@/module/category/pages/CategoryListPage";

export const metadata: Metadata = {
  title: "Category Management | UpTech-Z Admin",
  description: "Organize and curate course categories for the platform",
};

export default function Page() {
  return <CategoryListPage />;
}
