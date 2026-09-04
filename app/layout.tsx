import "./globals.css";
import AuthSessionProvider from "./components/SessionProvider";
import { NotificationProvider } from "./components/NotificationContext";
import Notification from "./components/Notification";
import NavBar from "./components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <AuthSessionProvider>
          <NotificationProvider>
            <NavBar />
            <Notification />
            <main className="max-w-4xl mx-auto p-6 mt-4">{children}</main>
          </NotificationProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
