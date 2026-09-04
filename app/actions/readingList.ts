"use server";

import { db } from "@/db";
import { readingList } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
