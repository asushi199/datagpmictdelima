"use client";

import Link from "next/link";
import { formatPkgZone } from "@/lib/data-utils";
import { useMemo, useState } from "react";
import type { PublicDirectoryRow, TeacherRole } from "@/lib/types";

type SortKey = "schoolCode" | "schoolName" | "teacherName" | "zone" | "phone";
type SortDirection = "asc" | "desc";
type Variant = "gpm" | "gpict" | "gpdelima";

const roleCopy: Record<TeacherRole, { title: string; eyebrow: string; empty: string }> = {
  GPM: {
    title: "Guru Perpustakaan dan Media",
    eyebrow: "Direktori GPM",
    empty: "Tiada rekod GPM sepadan.",
  },
  GPICT: {
    title: "Guru Penyelaras ICT",
    eyebrow: "Direktori GPICT",
    empty: "Tiada rekod GPICT sepadan.",
  },
  DELIMA: {
    title: "Guru Penyelaras DELIMa",
    eyebrow: "Direktori GP DELIMa",
    empty: "Tiada rekod GP DELIMa sepadan.",
  },
};

const sortLabels: Record<SortKey, string> = {
  schoolCode: "Kod Sekolah",
  schoolName: "Sekolah",
  teacherName: "Nama Guru",
  zone: "PKG",
  phone: "Telefon",
};

export function RoleDirectory({
  rows,
  role,
  variant,
}: {
  rows: PublicDirectoryRow[];
  role: TeacherRole;
  variant: Variant;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("schoolCode");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const copy = roleCopy[role];

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const roleRows = rows.filter((row) => row.role === role);
    const searched = q
      ? roleRows.filter((row) =>
          [row.schoolCode, row.schoolName, row.zone, row.teacherName, row.phone]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : roleRows;

    return [...searched].sort((a, b) => {
      const first = String(a[sortKey] || "").localeCompare(String(b[sortKey] || ""), "ms", {
        sensitivity: "base",
        numeric: true,
      });
      return sortDirection === "asc" ? first : -first;
    });
  }, [query, role, rows, sortDirection, sortKey]);

  return (
    <main className={`role-page role-${variant}`}>
      <section className="role-hero">
        <div>
          <span className="role-eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>Senarai mengikut sekolah untuk rujukan pantas PPD Manjung dan pihak sekolah.</p>
        </div>
        <div className="role-hero-actions">
          <Link className="button" href="/submit">
            Kemas Kini Data
          </Link>
          <Link className="button secondary" href="/">
            Semua Direktori
          </Link>
        </div>
      </section>

      <section className="role-toolbar">
        <div className="field">
          <label htmlFor="search">Carian</label>
          <input
            id="search"
            placeholder="Cari sekolah, nama guru, PKG atau telefon"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="sortKey">Susun ikut</label>
          <select id="sortKey" value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            {Object.entries(sortLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sortDirection">Arah</label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(event) => setSortDirection(event.target.value as SortDirection)}
          >
            <option value="asc">A ke Z</option>
            <option value="desc">Z ke A</option>
          </select>
        </div>
      </section>

      <section className="role-count">
        <strong>{filteredRows.length}</strong> rekod dipaparkan
      </section>

      <section className="role-card-grid">
        {filteredRows.map((row) => (
          <article className="directory-card" key={`${row.schoolCode}-${row.role}`}>
            <div>
              <span className="badge">{row.schoolCode}</span>
              <h2>{row.schoolName}</h2>
              <p>{formatPkgZone(row.zone)}</p>
            </div>
            <div className="teacher-block">
              <span>{row.teacherName || "Nama belum diisi"}</span>
              <strong>{row.phone || "-"}</strong>
            </div>
          </article>
        ))}
        {filteredRows.length === 0 ? <div className="panel muted">{copy.empty}</div> : null}
      </section>
    </main>
  );
}
