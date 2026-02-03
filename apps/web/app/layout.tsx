import type { ReactNode } from "react";

export const metadata = {
  title: "Manga Translate Helper Admin"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 0 }}>
        <div style={{ padding: 24 }}>
          <header style={{ marginBottom: 24 }}>
            <h1>Manga Translate Helper Admin</h1>
            <nav style={{ display: "flex", gap: 12 }}>
              <a href="/admin/books">Books</a>
              <a href="/admin/chapters">Chapters</a>
              <a href="/admin/pages">Pages</a>
              <a href="/admin/projects">Projects</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
