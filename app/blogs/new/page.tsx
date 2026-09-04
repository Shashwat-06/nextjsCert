"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBlog, type ActionState } from "../../actions/blogs";
import { useNotification } from "../../components/NotificationContext";

const initialState: ActionState = {
  error: "",
  success: false,
  values: { title: "", author: "", url: "" },
};

export default function NewBlog() {
  const [state, formAction] = useActionState(createBlog, initialState);
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      showNotification("Blog created successfully", "success");
      router.push("/blogs");
    }
  }, [state, showNotification, router]);

  return (
    <div>
      <h2>Create a new blog</h2>
      <form action={formAction}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={state?.values?.title}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            name="author"
            defaultValue={state?.values?.author}
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="text"
            name="url"
            defaultValue={state?.values?.url}
            required
          />
        </div>
        <button type="submit" data-testid="create-blog-button">
          Create
        </button>
        {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      </form>
    </div>
  );
}
