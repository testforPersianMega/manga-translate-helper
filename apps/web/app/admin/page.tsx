export default function AdminOverviewPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin dashboard</h1>
          <p style={{ color: "var(--muted)" }}>
            Manage books, chapters, and user access across the translation platform.
          </p>
        </div>
      </div>
      <div className="grid grid-2">
        <div className="card">
          <h3>Books & metadata</h3>
          <p style={{ color: "var(--muted)" }}>
            Create and update books, language metadata, and cover artwork.
          </p>
          <a className="button secondary" href="/admin/books">
            Manage books
          </a>
        </div>
        <div className="card">
          <h3>Chapters & assets</h3>
          <p style={{ color: "var(--muted)" }}>
            Upload chapter JSON and image URLs, reorder chapters, and maintain release status.
          </p>
          <a className="button secondary" href="/admin/chapters">
            Manage chapters
          </a>
        </div>
        <div className="card">
          <h3>Access control</h3>
          <p style={{ color: "var(--muted)" }}>
            Grant or revoke access so translators see only the books they own.
          </p>
          <a className="button secondary" href="/admin/access">
            Manage access
          </a>
        </div>
        <div className="card">
          <h3>User management</h3>
          <p style={{ color: "var(--muted)" }}>
            Promote admins and manage user roles from a single list.
          </p>
          <a className="button secondary" href="/admin/users">
            Manage users
          </a>
        </div>
      </div>
    </div>
  );
}
