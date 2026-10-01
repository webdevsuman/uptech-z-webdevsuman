import { Metadata } from "next";
import HomeAssetsListPage from "@/module/homepage/pages/HomeAssetsListPage";

export const metadata: Metadata = {
  title: "Homepage CMS | UpTech-Z Admin",
  description: "Manage homepage assets and sections for UpTech-Z LMS",
};

export default function Page() {
  return <HomeAssetsListPage />;
}
