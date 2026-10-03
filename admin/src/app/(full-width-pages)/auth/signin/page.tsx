import SignInForm from "@/module/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | UpTech-Z Admin",
  description: "Sign in to the UpTech-Z Administrator Control Panel",
};

export default function SignIn() {
  return <SignInForm />;
}
