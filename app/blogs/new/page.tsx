"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBlog } from "@/app/actions/blogs";

export default function NewBlog() {
  const router = useRouter();
  const [state, formAction] = useActionState(createBlog, {
    error: "",
    success: false,
    values: {},
  });

  useEffect(() => {
    if (state.success) router.push("/blogs");
  }, [state.success, router]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <form action={formAction} className="space-y-4 max-w-md">
        <div>
          <label>Title</label>
          <input
            name="title"
            defaultValue={state.values?.title || ""}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Author</label>
          <input
            name="author"
            defaultValue={state.values?.author || ""}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>URL</label>
          <input
            name="url"
            defaultValue={state.values?.url || ""}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Create
        </button>
        {state.error && <p className="text-red-500">{state.error}</p>}
      </form>
    </div>
  );
}
