import ForgotPasswordForm from "@/module/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | UpTech-Z",
  description: "Reset your UpTech-Z account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
