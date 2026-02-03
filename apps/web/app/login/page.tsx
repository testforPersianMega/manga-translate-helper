"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useToast } from "../components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setIsLoading(false);
    if (!response.ok) {
      setError("Invalid credentials. Please try again.");
      return;
    }
    const data = await response.json();
    notify("Welcome back!");
    router.push(data.redirectTo);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="card" style={{ width: "min(420px, 100%)" }}>
        <h2>Sign in to Manga Translate Helper</h2>
        <p style={{ color: "var(--muted)" }}>
          Admins manage the library. Translators jump right into their assigned books.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, marginTop: 20 }}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error ? <span style={{ color: "var(--danger)" }}>{error}</span> : null}
          <Button type="submit" full disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--muted)" }}>
          Demo admin: admin@example.com / admin123
        </div>
      </div>
    </div>
  );
}
