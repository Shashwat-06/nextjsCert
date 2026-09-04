import Link from "next/link";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { ilike, desc } from "drizzle-orm";

export default async function BlogsPage({
  searchParams,
}: {
  // searchParams MUST be a Promise in Next.js 15
  searchParams: Promise<{ filter?: string }>;
}) {
  // Await the promise before accessing properties
  const { filter } = await searchParams;

  const allBlogs = await db.query.blogs.findMany({
    where: filter ? ilike(blogs.title, `%${filter}%`) : undefined,
    orderBy: [desc(blogs.likes)], // Exercises require descending order by likes
  });

  return (
    <div>
      <h2>Blogs</h2>

      <form method="GET" action="/blogs">
        <input
          type="text"
          name="filter"
          defaultValue={filter || ""}
          data-testid="filter-input"
        />
        <button type="submit" data-testid="search-button">
          Search
        </button>
      </form>

      <ul data-testid="blogs-list">
        {allBlogs.map((blog) => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
            <span> - {blog.likes} likes</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
