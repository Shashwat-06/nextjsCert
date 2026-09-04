import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const DELETE = async () => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Forbidden in production" },
      { status: 403 },
    );
  }

  await db.execute(sql`TRUNCATE TABLE reading_list, blogs, users CASCADE;`);
  return NextResponse.json({ success: true });
};
