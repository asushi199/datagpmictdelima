"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.message ?? "Gagal log masuk.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="panel grid" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="password">Kata laluan admin</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
        />
      </div>
      {error ? <p className="error">{error}</p> : null}
      <button className="button" type="submit">
        Log Masuk
      </button>
    </form>
  );
}
