import { Metadata } from "next";
import TagAddPage from "@/module/tags/pages/TagAddPage";

export const metadata: Metadata = {
  title: "Add Tag | UpTech-Z Admin",
  description: "Create a new course tag in UpTech-Z LMS",
};

export default function Page() {
  return <TagAddPage />;
}
