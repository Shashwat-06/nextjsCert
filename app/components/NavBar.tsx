"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center gap-4">
      <Link href="/">home</Link>
      <Link href="/blogs">blogs</Link>
      <Link href="/users">users</Link>

      <div className="ml-auto flex items-center gap-4">
        {session ? (
          <>
            <Link href="/blogs/new">create new</Link>
            <Link href="/me">me</Link>
            <em>{session.user?.name} logged in</em>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded"
            >
              logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">login</Link>
            <Link href="/register">register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
