"use server";

import { redirect } from "next/navigation";
import {
  verifyPassword,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import { updateArticle } from "@/lib/db/articles-repository";

export async function loginAction(
  _prev: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const password = formData.get("password");
  if (typeof password !== "string" || !verifyPassword(password)) {
    return { error: "Incorrect password" };
  }
  await setAdminSession();
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/");
}

export async function publishArticleAction(id: string): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  await updateArticle(id, { status: "published" });
}

export async function unpublishArticleAction(id: string): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  await updateArticle(id, { status: "draft" });
}
