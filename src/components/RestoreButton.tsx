"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RestoreButton({ versionId }: { versionId: string }) {
  const router = useRouter();
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState("");

  async function restore() {
    setError("");
    setIsRestoring(true);
    const response = await fetch("/api/admin/restore-version", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ versionId }),
    });
    const payload = await response.json();
    setIsRestoring(false);
    if (!response.ok) {
      setError(payload.message ?? "Gagal memulihkan versi.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid">
      <button className="button secondary" type="button" onClick={restore} disabled={isRestoring}>
        {isRestoring ? "Memulihkan..." : "Pulihkan versi ini"}
      </button>
      {error ? <span className="error">{error}</span> : null}
    </div>
  );
}
