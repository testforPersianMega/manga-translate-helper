"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Table } from "../../components/Table";
import { useToast } from "../../components/ToastProvider";

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
};

type Book = {
  id: string;
  title: string;
};

type UserBook = {
  userId: string;
  bookId: string;
};

export default function AccessControlPage() {
  const { notify } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const loadData = async () => {
    const [usersResponse, booksResponse, userBooksResponse] = await Promise.all([
      fetch("/api/backend/users"),
      fetch("/api/backend/books"),
      fetch("/api/backend/user-books")
    ]);
    if (usersResponse.ok) {
      setUsers(await usersResponse.json());
    }
    if (booksResponse.ok) {
      setBooks(await booksResponse.json());
    }
    if (userBooksResponse.ok) {
      setUserBooks(await userBooksResponse.json());
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  const accessMap = useMemo(() => {
    const map = new Set(userBooks.map((entry) => `${entry.userId}:${entry.bookId}`));
    return map;
  }, [userBooks]);

  const toggleAccess = async (userId: string, bookId: string, hasAccess: boolean) => {
    const response = await fetch("/api/backend/user-books", {
      method: hasAccess ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bookId })
    });
    if (!response.ok) {
      notify("Unable to update access.");
      return;
    }
    notify(hasAccess ? "Access revoked." : "Access granted.");
    loadData();
  };

  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Access control</h1>
          <p style={{ color: "var(--muted)" }}>
            Grant or revoke access to books for each translator.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <label>
            <span className="label">User</span>
            <select
              className="input"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </label>
          {selectedUser ? <span className="pill">{selectedUser.role}</span> : null}
        </div>

        {books.length === 0 ? (
          <EmptyState
            title="No books yet"
            description="Create books first, then assign access to users."
          />
        ) : (
          <Table headers={["Book", "Access", "Action"]}>
            {books.map((book) => {
              const hasAccess = accessMap.has(`${selectedUserId}:${book.id}`);
              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{hasAccess ? "Granted" : "Not granted"}</td>
                  <td>
                    <Button
                      variant={hasAccess ? "ghost" : "secondary"}
                      onClick={() => toggleAccess(selectedUserId, book.id, hasAccess)}
                      disabled={!selectedUserId}
                    >
                      {hasAccess ? "Revoke" : "Grant"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </div>
    </div>
  );
}
