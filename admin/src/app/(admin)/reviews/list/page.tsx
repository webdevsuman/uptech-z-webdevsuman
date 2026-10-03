import { Metadata } from "next";
import ReviewListPage from "@/module/reviews/pages/ReviewListPage";

export const metadata: Metadata = {
  title: "Review Moderation | UpTech-Z Admin",
  description: "Monitor, filter, and moderate student reviews across all courses",
};

export default function Page() {
  return <ReviewListPage />;
}
