"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { Table } from "../../components/Table";
import { useToast } from "../../components/ToastProvider";

type Book = {
  id: string;
  title: string;
};

type Chapter = {
  id: string;
  bookId: string;
  number: string;
  title?: string;
  orderIndex: number;
  publishStatus: string;
  imageUrls: string[];
  sourceJson?: Record<string, unknown>;
};

const defaultForm = {
  bookId: "",
  number: "",
  title: "",
  orderIndex: 1,
  publishStatus: "DRAFT",
  imageUrls: "",
  sourceJson: ""
};

export default function ChaptersAdminPage() {
  const { notify } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState<Chapter | null>(null);

  const loadBooks = async () => {
    const response = await fetch("/api/backend/books");
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as Book[];
    setBooks(data);
    if (!selectedBookId && data.length > 0) {
      setSelectedBookId(data[0].id);
    }
  };

  const loadChapters = async (bookId: string) => {
    if (!bookId) {
      return;
    }
    const response = await fetch(`/api/backend/chapters?bookId=${bookId}`);
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as Chapter[];
    setChapters(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (selectedBookId) {
      loadChapters(selectedBookId);
    }
  }, [selectedBookId]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...defaultForm,
      bookId: selectedBookId
    });
    setIsModalOpen(true);
  };

  const openEdit = (chapter: Chapter) => {
    setEditing(chapter);
    setForm({
      bookId: chapter.bookId,
      number: chapter.number,
      title: chapter.title ?? "",
      orderIndex: chapter.orderIndex,
      publishStatus: chapter.publishStatus,
      imageUrls: chapter.imageUrls?.join("\n") ?? "",
      sourceJson: chapter.sourceJson ? JSON.stringify(chapter.sourceJson, null, 2) : ""
    });
    setIsModalOpen(true);
  };

  const onSave = async () => {
    let parsedSource: Record<string, unknown> | undefined;
    if (form.sourceJson.trim()) {
      try {
        parsedSource = JSON.parse(form.sourceJson);
      } catch {
        notify("Source JSON must be valid.");
        return;
      }
    }
    const payload = {
      bookId: form.bookId,
      number: form.number,
      title: form.title || undefined,
      orderIndex: Number(form.orderIndex),
      publishStatus: form.publishStatus,
      imageUrls: form.imageUrls ? form.imageUrls.split("\n").filter(Boolean) : [],
      sourceJson: parsedSource
    };
    const response = await fetch(`/api/backend/chapters${editing ? `/${editing.id}` : ""}`, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      notify("Unable to save chapter.");
      return;
    }
    notify(editing ? "Chapter updated." : "Chapter created.");
    setIsModalOpen(false);
    loadChapters(selectedBookId);
  };

  const onDelete = async (chapterId: string) => {
    const confirmed = window.confirm("Delete this chapter?");
    if (!confirmed) {
      return;
    }
    const response = await fetch(`/api/backend/chapters/${chapterId}`, { method: "DELETE" });
    if (response.ok) {
      notify("Chapter deleted.");
      loadChapters(selectedBookId);
    }
  };

  const onReorder = async (chapter: Chapter, direction: "up" | "down") => {
    const sorted = [...chapters].sort((a, b) => a.orderIndex - b.orderIndex);
    const index = sorted.findIndex((item) => item.id === chapter.id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) {
      return;
    }
    const target = sorted[targetIndex];
    await fetch(`/api/backend/chapters/${chapter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIndex: target.orderIndex })
    });
    await fetch(`/api/backend/chapters/${target.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderIndex: chapter.orderIndex })
    });
    notify("Chapters reordered.");
    loadChapters(selectedBookId);
  };

  const currentBook = useMemo(
    () => books.find((book) => book.id === selectedBookId),
    [books, selectedBookId]
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Chapters</h1>
          <p style={{ color: "var(--muted)" }}>Manage chapters, assets, and chapter JSON.</p>
        </div>
        <Button onClick={openCreate} disabled={!selectedBookId}>
          Add chapter
        </Button>
      </div>

      <div className="card">
        <div className="toolbar">
          <label>
            <span className="label">Book</span>
            <select
              className="input"
              value={selectedBookId}
              onChange={(event) => setSelectedBookId(event.target.value)}
            >
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>
          {currentBook ? <span className="pill">{currentBook.title}</span> : null}
        </div>

        {chapters.length === 0 ? (
          <EmptyState title="No chapters" description="Create a chapter to start structuring pages." />
        ) : (
          <Table headers={["Chapter", "Status", "Order", "Assets", "Actions"]}>
            {chapters
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((chapter) => (
                <tr key={chapter.id}>
                  <td>
                    <strong>#{chapter.number}</strong>
                    <div style={{ color: "var(--muted)" }}>{chapter.title ?? "Untitled"}</div>
                  </td>
                  <td>
                    <span className="badge">{chapter.publishStatus}</span>
                  </td>
                  <td>{chapter.orderIndex}</td>
                  <td>{chapter.imageUrls?.length ?? 0} image(s)</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Button variant="secondary" onClick={() => openEdit(chapter)}>
                        Edit
                      </Button>
                      <Button variant="ghost" onClick={() => onReorder(chapter, "up")}>
                        ↑
                      </Button>
                      <Button variant="ghost" onClick={() => onReorder(chapter, "down")}>
                        ↓
                      </Button>
                      <Button variant="danger" onClick={() => onDelete(chapter.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </Table>
        )}
      </div>

      {isModalOpen ? (
        <Modal title={editing ? "Edit chapter" : "Add chapter"} onClose={() => setIsModalOpen(false)}>
          <div style={{ display: "grid", gap: 12 }}>
            <label>
              <span className="label">Book</span>
              <select
                className="input"
                value={form.bookId}
                onChange={(event) => setForm({ ...form, bookId: event.target.value })}
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Chapter number"
              value={form.number}
              onChange={(event) => setForm({ ...form, number: event.target.value })}
            />
            <Input
              label="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <Input
              label="Order index"
              type="number"
              value={form.orderIndex}
              onChange={(event) => setForm({ ...form, orderIndex: Number(event.target.value) })}
            />
            <label>
              <span className="label">Publish status</span>
              <select
                className="input"
                value={form.publishStatus}
                onChange={(event) => setForm({ ...form, publishStatus: event.target.value })}
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </label>
            <label>
              <span className="label">Image URLs (one per line)</span>
              <textarea
                className="input"
                rows={3}
                value={form.imageUrls}
                onChange={(event) => setForm({ ...form, imageUrls: event.target.value })}
              />
            </label>
            <label>
              <span className="label">Source JSON</span>
              <textarea
                className="input"
                rows={4}
                value={form.sourceJson}
                onChange={(event) => setForm({ ...form, sourceJson: event.target.value })}
              />
            </label>
            <Button onClick={onSave}>Save chapter</Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
