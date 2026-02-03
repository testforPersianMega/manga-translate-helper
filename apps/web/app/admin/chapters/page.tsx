export default function ChaptersAdminPage() {
  return (
    <main>
      <h2>Chapters</h2>
      <p>Manage chapters for a book. Hook to /api/v1/chapters.</p>
      <form style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input name="bookId" placeholder="Book ID" />
        <input name="number" placeholder="Chapter number" />
        <input name="title" placeholder="Title" />
        <input name="orderIndex" placeholder="Order index" />
        <select name="publishStatus" defaultValue="DRAFT">
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
        <button type="button">Create Chapter</button>
      </form>
    </main>
  );
}
