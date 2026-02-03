import type { ReactNode } from "react";
import { LogoutButton } from "../components/LogoutButton";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">MTH</div>
        <nav>
          <a href="/app">My Books</a>
        </nav>
        <LogoutButton />
        <div className="meta">Translate and track chapter progress.</div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
