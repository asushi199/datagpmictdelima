"use client";

import { useMemo, useState } from "react";
import type { PublicDirectoryRow } from "@/lib/types";

export function PublicDirectory({ rows }: { rows: PublicDirectoryRow[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [
        row.schoolCode,
        row.schoolName,
        row.zone,
        row.role,
        row.teacherName,
        row.phone,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, rows]);

  return (
    <div className="grid">
      <div className="panel">
        <div className="field">
          <label htmlFor="search">Carian</label>
          <input
            id="search"
            placeholder="Cari sekolah, nama guru, peranan atau nombor telefon"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sekolah</th>
              <th>Zon</th>
              <th>Peranan</th>
              <th>Nama Guru</th>
              <th>No. Telefon</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={`${row.schoolCode}-${row.role}`}>
                <td>
                  <strong>{row.schoolName}</strong>
                  <div className="muted">{row.schoolCode}</div>
                </td>
                <td>{row.zone || "-"}</td>
                <td>
                  <span className="badge">{row.role}</span>
                </td>
                <td>{row.teacherName || "-"}</td>
                <td>{row.phone || "-"}</td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="muted">
                  Tiada rekod sepadan.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
