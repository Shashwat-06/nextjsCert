"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type RegisterState = {
  error: string;
  fieldErrors?: {
    username?: string;
    passwordConfirm?: string;
  };
};

export const registerUser = async (
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  if (username.length < 4) {
    return {
      error: "",
      fieldErrors: { username: "Username must be at least 4 characters" },
    };
  }

  if (password !== passwordConfirm) {
    return {
      error: "",
      fieldErrors: { passwordConfirm: "Passwords do not match" },
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (existingUser) {
    return { error: "Username already exists", fieldErrors: {} };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({ username, name, passwordHash });

  redirect("/login");
};

export const generateToken = async () => {
  const session = await auth();
  if (!session?.user?.email) return;

  const token = crypto.randomUUID();
  await db
    .update(users)
    .set({ token })
    .where(eq(users.username, session.user.email));

  revalidatePath("/me");
};
