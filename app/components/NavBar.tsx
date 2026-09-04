"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-6 shadow-md">
      <Link href="/" className="hover:text-blue-400 font-bold text-lg">
        Home
      </Link>
      <Link href="/blogs" className="hover:text-blue-400">
        Blogs
      </Link>

      <div className="ml-auto flex items-center gap-4">
        {session ? (
          <>
            <Link href="/blogs/new" className="hover:text-blue-400">
              Create Blog
            </Link>
            <Link
              href="/me"
              className="hover:text-blue-400 text-sm text-gray-300"
            >
              My Page
            </Link>
            <em className="text-gray-400 text-sm hidden sm:block">
              {session.user?.name} logged in
            </em>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-400">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
