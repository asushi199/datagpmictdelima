"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EditSchoolNameForm({ schoolCode, schoolName }: { schoolCode: string; schoolName: string }) {
  const router = useRouter();
  const [name, setName] = useState(schoolName);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const response = await fetch("/api/admin/update-school-name", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ schoolCode, name }),
    });
    const payload = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(payload.message ?? "Gagal mengemas kini nama sekolah.");
      return;
    }

    setName(name.trim().replace(/\s+/g, " ").toUpperCase());
    router.refresh();
  }

  return (
    <form className="edit-school-form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="schoolName">Nama sekolah</label>
        <input
          id="schoolName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contoh: SJKC UK ING"
          required
        />
      </div>
      <button className="button secondary" type="submit" disabled={isSaving}>
        {isSaving ? "Menyimpan..." : "Simpan Nama Sekolah"}
      </button>
      {error ? <p className="error">{error}</p> : null}
      <p className="muted">Nama akan disimpan dalam huruf besar dan dikemas kini pada semua sejarah sekolah ini.</p>
    </form>
  );
}
