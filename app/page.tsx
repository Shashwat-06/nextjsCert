export default function Home() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 prose prose-blue max-w-none">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
        Welcome to the Blog App
      </h1>
      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        This is a full-stack Next.js application built for the MOOC.fi course.
        It features Server Components, Server Actions, and a PostgreSQL database
        using Drizzle ORM.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">Features</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Authentication via NextAuth.js</li>
        <li>Server-side rendering and static rendering</li>
        <li>Tailwind CSS styling</li>
        <li>Automated testing endpoints</li>
      </ul>

      <hr className="my-8 border-gray-200" />

      <p className="text-gray-500 text-sm">
        Use the navigation bar above to view the blog list, register a new
        account, or log in to create your own posts.
      </p>
    </div>
  );
}
