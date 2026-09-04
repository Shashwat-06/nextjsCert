"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Define the exact shape of our state
export type RegisterState = {
  error: string;
  values: {
    username: string;
    name: string;
  };
};

export const registerUser = async (
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const username = (formData.get("username") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  if (!username || username.length < 4) {
    return {
      error: "Username must be at least 4 characters long",
      values: { username, name },
    };
  }
  if (!password || password.length < 4) {
    return {
      error: "Password must be at least 4 characters long",
      values: { username, name },
    };
  }
  if (password !== passwordConfirm) {
    return { error: "Passwords do not match", values: { username, name } };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (existingUser) {
    return {
      error: "Username already exists. Choose another one.",
      values: { username, name },
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({ username, name, passwordHash });

  redirect("/login");
};
