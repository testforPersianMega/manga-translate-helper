"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/ToastProvider";

type BookAccess = {
  book: {
    id: string;
    title: string;
    description?: string;
    coverImageUrl?: string;
    language: string;
    status: string;
  };
};

export default function MyBooksPage() {
  const { notify } = useToast();
  const [books, setBooks] = useState<BookAccess[]>([]);

  const loadBooks = async () => {
    const response = await fetch("/api/backend/user-books/mine");
    if (!response.ok) {
      notify("Unable to load your books.");
      return;
    }
    setBooks(await response.json());
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Books</h1>
          <p style={{ color: "var(--muted)" }}>Only the books you have access to appear here.</p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="card">
          <EmptyState title="No assigned books" description="Ask an admin to grant access." />
        </div>
      ) : (
        <div className="grid grid-2">
          {books.map((entry) => (
            <a className="card" key={entry.book.id} href={`/app/books/${entry.book.id}`}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h3 style={{ marginTop: 0 }}>{entry.book.title}</h3>
                  <p style={{ color: "var(--muted)" }}>{entry.book.description ?? "No description."}</p>
                </div>
                <span className="pill">{entry.book.status}</span>
              </div>
              <div style={{ marginTop: 16, color: "var(--muted)" }}>
                Language: {entry.book.language}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
