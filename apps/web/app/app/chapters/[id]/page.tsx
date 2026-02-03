"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/ToastProvider";

type Chapter = {
  id: string;
  number: string;
  title?: string;
  sourceJson?: Record<string, unknown>;
};

type Translation = {
  id: string;
  translatedJson?: Record<string, unknown>;
  status: string;
  updatedAt: string;
};

export default function ChapterTranslatePage() {
  const { id } = useParams<{ id: string }>();
  const { notify } = useToast();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [draft, setDraft] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sourceJson = useMemo(() => {
    if (!chapter?.sourceJson) {
      return "No source JSON attached.";
    }
    return JSON.stringify(chapter.sourceJson, null, 2);
  }, [chapter]);

  const load = async () => {
    const [chapterRes, translationRes] = await Promise.all([
      fetch(`/api/backend/chapters/${id}`),
      fetch(`/api/backend/translations?chapterId=${id}`)
    ]);
    if (chapterRes.ok) {
      setChapter(await chapterRes.json());
    }
    if (translationRes.ok) {
      const translations = (await translationRes.json()) as Translation[];
      const current = translations[0] ?? null;
      setTranslation(current);
      if (current?.translatedJson) {
        setDraft(JSON.stringify(current.translatedJson, null, 2));
      }
      if (current?.updatedAt) {
        setLastSaved(new Date(current.updatedAt).toLocaleString());
      }
    }
  };

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  const save = async (status: string) => {
    setIsSaving(true);
    let parsed: Record<string, unknown> | undefined;
    if (draft.trim()) {
      try {
        parsed = JSON.parse(draft);
      } catch {
        notify("Translation must be valid JSON.");
        setIsSaving(false);
        return;
      }
    }
    const response = await fetch("/api/backend/translations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId: id, translatedJson: parsed, status })
    });
    setIsSaving(false);
    if (response.ok) {
      const data = (await response.json()) as Translation;
      setTranslation(data);
      setLastSaved(new Date(data.updatedAt).toLocaleString());
      notify(status === "COMPLETE" ? "Marked complete." : "Draft saved.");
    } else {
      notify("Unable to save translation.");
    }
  };

  useEffect(() => {
    if (!draft) {
      return;
    }
    const timer = setTimeout(() => {
      save("DRAFT");
    }, 1200);
    return () => clearTimeout(timer);
  }, [draft]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Chapter {chapter?.number}</h1>
          <p style={{ color: "var(--muted)" }}>{chapter?.title ?? "Translation workspace"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            Last saved: {lastSaved ?? "Not yet"}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="secondary" onClick={() => save("DRAFT")} disabled={isSaving}>
              Save draft
            </Button>
            <Button onClick={() => save("COMPLETE")} disabled={isSaving}>
              Mark complete
            </Button>
          </div>
        </div>
      </div>

      <div className="split-view">
        <div className="card">
          <h3>Source JSON</h3>
          <textarea className="input" rows={20} value={sourceJson} readOnly />
        </div>
        <div className="card">
          <h3>Translation JSON</h3>
          <textarea
            className="input"
            rows={20}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Paste translated JSON here."
          />
        </div>
      </div>
    </div>
  );
}
