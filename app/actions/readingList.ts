"use server";

import { db } from "@/db";
import { readingList, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export const markAsRead = async (formData: FormData) => {
  const id = Number(formData.get("id"));
  if (id) {
    await db
      .update(readingList)
      .set({ read: true })
      .where(eq(readingList.id, id));
    revalidatePath("/me");
  }
};

export const addToReadingList = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.email) return;

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
  });
  if (!user) return;

  const blogId = Number(formData.get("blogId"));
  if (!blogId) return;

  const existing = await db.query.readingList.findFirst({
    where: and(eq(readingList.userId, user.id), eq(readingList.blogId, blogId)),
  });

  // Only add if it's not already in the list
  if (!existing) {
    await db.insert(readingList).values({
      userId: user.id,
      blogId,
    });
  }

  revalidatePath(`/blogs/${blogId}`);
  revalidatePath("/me");
};
