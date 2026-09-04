import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "../actions/users"; // Adjust this import to your actual action path
import { markAsRead } from "../actions/readingList"; // Adjust this import to your actual action path

export default async function MePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, session.user.email),
    with: {
      readingList: {
        with: {
          blog: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const unreadBlogs = user.readingList.filter((item) => !item.read);
  const readBlogs = user.readingList.filter((item) => item.read);

  return (
    <div>
      <h2>My Profile</h2>
      <div data-testid="user-profile">
        <p data-testid="user-name">Name: {user.name}</p>
        <p data-testid="user-username">Username: {user.username}</p>
      </div>

      <div data-testid="api-token-section">
        <h3>API Token</h3>
        {user.token ? (
          <div data-testid="token-display">
            <code data-testid="api-token">{user.token}</code>
          </div>
        ) : (
          <p data-testid="no-token-message">No token generated yet.</p>
        )}
        <form action={generateToken}>
          <button type="submit" data-testid="generate-token-button">
            Generate Token
          </button>
        </form>
      </div>

      <div data-testid="reading-list-section">
        <h3>Reading List</h3>
        {user.readingList.length === 0 ? (
          <p data-testid="empty-reading-list">Your reading list is empty.</p>
        ) : (
          <div data-testid="unread-section">
            <h4>Unread</h4>
            {unreadBlogs.length === 0 ? (
              <p data-testid="no-unread-blogs">No unread blogs.</p>
            ) : (
              <ul>
                {unreadBlogs.map((item) => (
                  <li key={item.id}>
                    {item.blog.title}
                    <form action={markAsRead}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        data-testid={`mark-read-${item.id}`}
                      >
                        Mark as read
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
