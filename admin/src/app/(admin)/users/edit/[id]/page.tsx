import { Metadata } from "next";
import UsersEditPage from "@/module/users/pages/UsersEditPage";

export const metadata: Metadata = {
  title: "Edit User | UpTech-Z Admin",
  description: "Update user profile details, status, and qualifications in UpTech-Z LMS",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <UsersEditPage id={id} />;
}
