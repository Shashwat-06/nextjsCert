"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { blogs, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error: string;
  success?: boolean;
  values: {
    title: string;
    author: string;
    url: string;
  };
};

export const createBlog = async (
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const url = formData.get("url") as string;

  const currentValues = { title, author, url };

  if (title.length < 5 || author.length < 5 || url.length < 5) {
    return {
      error: "Fields must be at least 5 characters long",
      success: false,
      values: currentValues,
    };
  }

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  });

  if (!user) redirect("/login");

  await db.insert(blogs).values({
    title,
    author,
    url,
    userId: user.id,
  });

  revalidatePath("/blogs");
  return {
    error: "",
    success: true,
    values: { title: "", author: "", url: "" },
  };
};
