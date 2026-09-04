"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { blogs, users, readingList } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error: string;
  success?: boolean;
  values: { title: string; author: string; url: string };
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
      error: "Fields must be at least 5 characters",
      success: false,
      values: currentValues,
    };
  }

  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  });

  if (!user) redirect("/login");

  // Create the blog and return the inserted data to get the ID
  const newBlog = await db
    .insert(blogs)
    .values({
      title,
      author,
      url,
      userId: user.id,
    })
    .returning();

  // Exercise 20: Each blog the user adds should be by default added to their reading list
  if (newBlog[0]) {
    await db.insert(readingList).values({
      userId: user.id,
      blogId: newBlog[0].id,
    });
  }

  revalidatePath("/blogs");
  return {
    error: "",
    success: true,
    values: { title: "", author: "", url: "" },
  };
};

export const likeBlog = async (formData: FormData) => {
  const id = Number(formData.get("id"));
  if (!id) return;

  const blog = await db.query.blogs.findFirst({ where: eq(blogs.id, id) });
  if (blog) {
    await db
      .update(blogs)
      .set({ likes: blog.likes + 1 })
      .where(eq(blogs.id, id));
    revalidatePath(`/blogs/${id}`);
    revalidatePath("/blogs");
  }
};
