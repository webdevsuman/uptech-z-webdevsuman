import { Metadata } from "next";
import TagEditPage from "@/module/tags/pages/TagEditPage";

export const metadata: Metadata = {
  title: "Edit Tag | UpTech-Z Admin",
  description: "Update course tag details in UpTech-Z LMS",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <TagEditPage id={id} />;
}
