import type { ReactNode } from "react";
import { LogoutButton } from "../components/LogoutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">MTH Admin</div>
        <nav>
          <a href="/admin">Overview</a>
          <a href="/admin/books">Books</a>
          <a href="/admin/chapters">Chapters</a>
          <a href="/admin/access">Access Control</a>
          <a href="/admin/users">Users</a>
        </nav>
        <LogoutButton />
        <div className="meta">Manage catalog, chapters, and access.</div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
