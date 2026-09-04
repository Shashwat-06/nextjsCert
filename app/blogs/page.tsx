import Link from "next/link";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { desc, ilike } from "drizzle-orm";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const { filter } = searchParams;

  const allBlogs = await db.query.blogs.findMany({
    where: filter ? ilike(blogs.title, `%${filter}%`) : undefined,
    orderBy: [desc(blogs.likes)],
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <form method="GET" className="mb-4">
        <input
          name="filter"
          placeholder="Search titles..."
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-gray-200 px-4 py-2">
          Search
        </button>
      </form>
      <ul className="space-y-2">
        {allBlogs.map((blog) => (
          <li key={blog.id} className="border p-3">
            <Link
              href={`/blogs/${blog.id}`}
              className="text-blue-600 hover:underline"
            >
              {blog.title}
            </Link>{" "}
            by {blog.author} ({blog.likes} likes)
          </li>
        ))}
      </ul>
    </div>
  );
}
