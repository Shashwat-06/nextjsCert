import { notFound } from "next/navigation";
import { db } from "@/db";
import { blogs, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { likeBlog } from "../../actions/blogs";
import { addToReadingList } from "../../actions/readingList";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blogId = parseInt(id, 10);

  if (isNaN(blogId)) notFound();

  const blog = await db.query.blogs.findFirst({
    where: eq(blogs.id, blogId),
    with: { user: true },
  });

  if (!blog) notFound();

  const session = await auth();
  let currentUser = null;

  if (session?.user?.email) {
    currentUser = await db.query.users.findFirst({
      where: eq(users.username, session.user.email),
    });
  }

  const isOwner = currentUser?.id === blog.userId;

  return (
    <div data-testid="blog-detail">
      <h2 data-testid="blog-title">{blog.title}</h2>
      <p data-testid="blog-author">Author: {blog.author}</p>
      <p>URL: {blog.url}</p>
      <p>{blog.likes} likes</p>

      <form action={likeBlog}>
        <input type="hidden" name="id" value={blog.id} />
        <button type="submit" data-testid="like-button">
          Like
        </button>
      </form>

      {currentUser && !isOwner && (
        <form action={addToReadingList}>
          <input type="hidden" name="blogId" value={blog.id} />
          <button type="submit" data-testid="add-to-reading-list-button">
            Add to reading list
          </button>
        </form>
      )}
    </div>
  );
}
