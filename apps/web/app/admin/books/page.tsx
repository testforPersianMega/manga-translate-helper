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
  slug: string;
  description?: string;
  language: string;
  status: string;
  coverImageUrl?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
};

const defaultForm = {
  title: "",
  slug: "",
  description: "",
  language: "en",
  status: "ONGOING",
  coverImageUrl: "",
  meta: ""
};

export default function BooksAdminPage() {
  const { notify } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("title");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState<Book | null>(null);

  const loadBooks = async () => {
    const response = await fetch("/api/backend/books");
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as Book[];
    setBooks(data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => book.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === "createdAt") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [books, search, sortKey]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditing(book);
    setForm({
      title: book.title,
      slug: book.slug,
      description: book.description ?? "",
      language: book.language,
      status: book.status,
      coverImageUrl: book.coverImageUrl ?? "",
      meta: book.meta ? JSON.stringify(book.meta, null, 2) : ""
    });
    setIsModalOpen(true);
  };

  const onSave = async () => {
    setIsSaving(true);
    let metaValue: Record<string, unknown> | undefined;
    if (form.meta.trim()) {
      try {
        metaValue = JSON.parse(form.meta);
      } catch {
        notify("Meta must be valid JSON.");
        setIsSaving(false);
        return;
      }
    }
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description || undefined,
      language: form.language,
      status: form.status,
      coverImageUrl: form.coverImageUrl || undefined,
      meta: metaValue
    };
    const response = await fetch(`/api/backend/books${editing ? `/${editing.id}` : ""}`, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setIsSaving(false);
    if (!response.ok) {
      notify("Unable to save book.");
      return;
    }
    notify(editing ? "Book updated." : "Book created.");
    setIsModalOpen(false);
    await loadBooks();
  };

  const onDelete = async (bookId: string) => {
    const confirmed = window.confirm("Delete this book? This cannot be undone.");
    if (!confirmed) {
      return;
    }
    const response = await fetch(`/api/backend/books/${bookId}`, { method: "DELETE" });
    if (response.ok) {
      notify("Book deleted.");
      loadBooks();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Books</h1>
          <p style={{ color: "var(--muted)" }}>Create, update, and curate the library catalog.</p>
        </div>
        <Button onClick={openCreate}>New book</Button>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            className="input"
            style={{ maxWidth: 280 }}
            placeholder="Search books"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="input"
            style={{ maxWidth: 180 }}
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
          >
            <option value="title">Sort by title</option>
            <option value="createdAt">Sort by newest</option>
          </select>
        </div>

        {filteredBooks.length === 0 ? (
          <EmptyState title="No books yet" description="Create your first book to get started." />
        ) : (
          <Table headers={["Title", "Language", "Status", "Updated", "Actions"]}>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>
                  <strong>{book.title}</strong>
                  <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{book.slug}</div>
                </td>
                <td>{book.language}</td>
                <td>
                  <span className="badge">{book.status}</span>
                </td>
                <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button variant="secondary" onClick={() => openEdit(book)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(book.id)}>
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
        <Modal title={editing ? "Edit book" : "Create book"} onClose={() => setIsModalOpen(false)}>
          <div style={{ display: "grid", gap: 12 }}>
            <Input
              label="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
            <Input
              label="Language"
              value={form.language}
              onChange={(event) => setForm({ ...form, language: event.target.value })}
            />
            <label>
              <span className="label">Status</span>
              <select
                className="input"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="HIATUS">HIATUS</option>
              </select>
            </label>
            <Input
              label="Cover image URL"
              value={form.coverImageUrl}
              onChange={(event) => setForm({ ...form, coverImageUrl: event.target.value })}
            />
            <label>
              <span className="label">Meta (JSON)</span>
              <textarea
                className="input"
                rows={4}
                value={form.meta}
                onChange={(event) => setForm({ ...form, meta: event.target.value })}
              />
            </label>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save book"}
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
