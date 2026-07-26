"use server";

import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession } from "@/lib/session";

export type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    return { error: "Admin credentials are not configured." };
  }

  if (username !== validUsername || password !== validPassword) {
    return { error: "Invalid username or password." };
  }

  await createAdminSession(username);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
