export default function PagesAdminPage() {
  return (
    <section>
      <h2>Pages</h2>
      <p>Manage pages and upload images. Hook to /api/v1/pages.</p>
      <form style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input name="chapterId" placeholder="Chapter ID" />
        <input name="pageNumber" placeholder="Page number" />
        <input name="imageUrl" placeholder="Image URL" />
        <input name="width" placeholder="Width" />
        <input name="height" placeholder="Height" />
        <input name="checksum" placeholder="Checksum" />
        <button type="button">Create Page</button>
      </form>
    </section>
  );
}
