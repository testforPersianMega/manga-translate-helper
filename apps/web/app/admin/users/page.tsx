"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { useToast } from "../../components/ToastProvider";

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
};

export default function UsersAdminPage() {
  const { notify } = useToast();
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const response = await fetch("/api/backend/users");
    if (response.ok) {
      setUsers(await response.json());
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (userId: string, role: string) => {
    const response = await fetch(`/api/backend/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    if (response.ok) {
      notify("User role updated.");
      loadUsers();
    } else {
      notify("Unable to update role.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p style={{ color: "var(--muted)" }}>
            Promote admins or keep translators as standard users.
          </p>
        </div>
      </div>

      <div className="card">
        <Table headers={["User", "Role", "Last login", "Action"]}>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <strong>{user.username}</strong>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{user.email}</div>
              </td>
              <td>{user.role === "ADMIN" ? "ADMIN" : "USER"}</td>
              <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "—"}</td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="secondary" onClick={() => updateRole(user.id, "ADMIN")}>
                    Make admin
                  </Button>
                  <Button variant="ghost" onClick={() => updateRole(user.id, "VIEWER")}>
                    Make user
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
