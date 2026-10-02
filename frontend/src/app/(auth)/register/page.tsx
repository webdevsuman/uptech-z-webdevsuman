import SignUpForm from "@/module/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | UpTech-Z",
  description: "Create an UpTech-Z account as a student or instructor.",
};

export default function RegisterPage() {
  return <SignUpForm />;
}
