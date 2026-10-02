import { Metadata } from "next";
import UsersListPage from "@/module/users/pages/UsersListPage";

export const metadata: Metadata = {
  title: "Users Management | UpTech-Z Admin",
  description: "Manage system users, roles, and verification status",
};

export default function Page() {
  return <UsersListPage />;
}
