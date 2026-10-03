import SignUpForm from "@/module/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | UpTech-Z Admin",
  description: "Create an administrator account for UpTech-Z",
};

export default function SignUp() {
  return <SignUpForm />;
}
