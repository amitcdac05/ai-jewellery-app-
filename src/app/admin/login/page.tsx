import type { Metadata } from "next";
import { LoginForm } from "@/features/admin/auth/login-form";

export const metadata: Metadata = {
  title: "Admin Login | AI Jewellery",
};

export default function AdminLoginPage() {
  return (
    <div className="bg-luxury-radial min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
