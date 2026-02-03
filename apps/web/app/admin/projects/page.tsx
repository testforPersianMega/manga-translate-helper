export default function ProjectsAdminPage() {
  return (
    <main>
      <h2>Translation Projects</h2>
      <p>Manage translation projects. Hook to /api/v1/projects.</p>
      <form style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input name="chapterId" placeholder="Chapter ID" />
        <input name="assignedUserIds" placeholder="Assigned user IDs (comma-separated)" />
        <button type="button">Create Project</button>
      </form>
    </main>
  );
}
