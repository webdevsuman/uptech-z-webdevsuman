import { Metadata } from "next";
import TagListPage from "@/module/tags/pages/TagListPage";

export const metadata: Metadata = {
  title: "Tag Management | UpTech-Z Admin",
  description: "Organize and curate course tags for the platform",
};

export default function Page() {
  return <TagListPage />;
}
