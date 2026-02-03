export default function BooksAdminPage() {
  return (
    <main>
      <h2>Books</h2>
      <p>List and manage books. Hook to /api/v1/books.</p>
      <form style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input name="title" placeholder="Title" />
        <input name="slug" placeholder="Slug" />
        <input name="language" placeholder="Language" />
        <select name="status" defaultValue="ONGOING">
          <option value="ONGOING">ONGOING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="HIATUS">HIATUS</option>
        </select>
        <button type="button">Create Book</button>
      </form>
    </main>
  );
}
