"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
// FIX 1: Import 'users' alongside 'blogs'
import { blogs, users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Define a clear type for the state to keep TypeScript happy
type ActionState = {
  error: string;
  success: boolean;
  values: { title: string; author: string; url: string };
};

export const createBlog = async (
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const session = await auth();

  // FIX 2: Strictly check that session, user, and email exist
  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

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
    where: eq(users.username, session.user.email),
  });

  await db.insert(blogs).values({ title, author, url, userId: user!.id });

  revalidatePath("/blogs");
  return {
    error: "",
    success: true,
    values: { title: "", author: "", url: "" },
  };
};
