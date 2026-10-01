import { Metadata } from "next";
import AddHomeAssetPage from "@/module/homepage/pages/AddHomeAssetPage";

export const metadata: Metadata = {
  title: "Add Homepage Asset | UpTech-Z Admin",
  description: "Create a new homepage content asset for UpTech-Z LMS",
};

export default function Page() {
  return <AddHomeAssetPage />;
}
