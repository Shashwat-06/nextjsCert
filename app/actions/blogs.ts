"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createBlog = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session) redirect("/login");

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = formData.get("url") as string;

  if (title.length < 5 || author.length < 5 || url.length < 5) {
    return {
      error: "Title, author, and url must be at least 5 characters.",
      success: false,
      values: { title, author, url },
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email!),
  });

  await db.insert(blogs).values({ title, author, url, userId: user!.id });

  revalidatePath("/blogs");
  return {
    error: "",
    success: true,
    values: { title: "", author: "", url: "" },
  };
};
