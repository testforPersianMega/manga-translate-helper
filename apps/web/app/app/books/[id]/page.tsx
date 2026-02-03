"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EmptyState } from "../../../components/EmptyState";
import { useToast } from "../../../components/ToastProvider";

type Book = {
  id: string;
  title: string;
  description?: string;
  language: string;
  status: string;
};

type Chapter = {
  id: string;
  number: string;
  title?: string;
  orderIndex: number;
  publishStatus: string;
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { notify } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const load = async () => {
      const [bookRes, chaptersRes] = await Promise.all([
        fetch(`/api/backend/books/${id}`),
        fetch(`/api/backend/chapters?bookId=${id}`)
      ]);
      if (bookRes.ok) {
        setBook(await bookRes.json());
      } else {
        notify("Unable to load book.");
      }
      if (chaptersRes.ok) {
        setChapters(await chaptersRes.json());
      }
    };
    if (id) {
      load();
    }
  }, [id, notify]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{book?.title ?? "Book"}</h1>
          <p style={{ color: "var(--muted)" }}>{book?.description ?? "No description."}</p>
        </div>
        {book ? <span className="pill">{book.status}</span> : null}
      </div>

      <div className="card">
        {chapters.length === 0 ? (
          <EmptyState title="No chapters yet" description="Check back once chapters are ready." />
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {chapters
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((chapter) => (
                <a
                  key={chapter.id}
                  className="card"
                  href={`/app/chapters/${chapter.id}`}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <strong>Chapter {chapter.number}</strong>
                    <div style={{ color: "var(--muted)" }}>{chapter.title ?? "Untitled"}</div>
                  </div>
                  <span className="badge">{chapter.publishStatus}</span>
                </a>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
