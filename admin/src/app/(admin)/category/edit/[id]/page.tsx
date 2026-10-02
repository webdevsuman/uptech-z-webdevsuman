import { Metadata } from "next";
import CategoryEditPage from "@/module/category/pages/CategoryEditPage";

export const metadata: Metadata = {
  title: "Edit Category | UpTech-Z Admin",
  description: "Update course category details in UpTech-Z LMS",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <CategoryEditPage id={id} />;
}
