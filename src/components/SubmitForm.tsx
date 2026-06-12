"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPkgZone } from "@/lib/data-utils";
import type { PublicDirectoryRow, SchoolOption, TeacherRole } from "@/lib/types";

const roles: { key: TeacherRole; label: string; short: string }[] = [
  { key: "GPICT", label: "Guru Penyelaras ICT", short: "GPICT" },
  { key: "DELIMA", label: "Guru Penyelaras DELIMa", short: "GP DELIMa" },
  { key: "GPM", label: "Guru Perpustakaan dan Media", short: "GPM" },
];

type RoleState = Record<TeacherRole, { teacherName: string; phone: string }>;

const emptyRoleState: RoleState = {
  GPICT: { teacherName: "", phone: "" },
  DELIMA: { teacherName: "", phone: "" },
  GPM: { teacherName: "", phone: "" },
};

export function SubmitForm({
  schools,
  currentRows,
}: {
  schools: SchoolOption[];
  currentRows: PublicDirectoryRow[];
}) {
  const router = useRouter();
  const sortedSchools = useMemo(
    () => [...schools].sort((a, b) => a.code.localeCompare(b.code, "ms", { numeric: true })),
    [schools],
  );
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolCode, setSchoolCode] = useState(sortedSchools[0]?.code ?? "");
  const [activeRole, setActiveRole] = useState<TeacherRole>("GPICT");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterPhone, setSubmitterPhone] = useState("");
  const [roleState, setRoleState] = useState<RoleState>(emptyRoleState);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredSchools = useMemo(() => {
    const query = schoolQuery.trim().toLowerCase();
    if (!query) return sortedSchools;
    return sortedSchools.filter((school) =>
      [school.code, school.name, school.zone]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [schoolQuery, sortedSchools]);

  const selectedSchool = useMemo(
    () => sortedSchools.find((school) => school.code === schoolCode),
    [schoolCode, sortedSchools],
  );

  useEffect(() => {
    if (filteredSchools.length === 0) {
      setSchoolCode("");
      return;
    }

    if (!filteredSchools.some((school) => school.code === schoolCode)) {
      setSchoolCode(filteredSchools[0].code);
    }
  }, [filteredSchools, schoolCode]);

  useEffect(() => {
    setRoleState(buildRoleStateForSchool(currentRows, schoolCode));
  }, [currentRows, schoolCode]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        schoolCode,
        schoolName: selectedSchool?.name ?? "",
        zone: selectedSchool?.zone ?? "",
        submitterName,
        submitterPhone,
        roles: roleState,
      }),
    });

    const payload = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(payload.message ?? "Gagal menghantar kemas kini.");
      return;
    }

    router.push("/submit/success");
  }

  const selectedRole = roles.find((role) => role.key === activeRole) ?? roles[0];

  return (
    <form className="grid" onSubmit={onSubmit}>
      <div className="panel grid two school-lookup-panel">
        <div className="field school-search-field">
          <label htmlFor="schoolSearch">Cari sekolah</label>
          <input
            id="schoolSearch"
            value={schoolQuery}
            onChange={(event) => setSchoolQuery(event.target.value)}
            placeholder="Taip kod sekolah atau nama sekolah, contoh: ABC1053 atau UK ING"
          />
          <span className="lookup-hint">{filteredSchools.length} sekolah sepadan</span>
        </div>
        <div className="field">
          <label htmlFor="school">Kod Sekolah / Sekolah</label>
          <select
            id="school"
            value={schoolCode}
            onChange={(event) => setSchoolCode(event.target.value)}
            required
            disabled={filteredSchools.length === 0}
          >
            {filteredSchools.length === 0 ? (
              <option value="">Tiada sekolah sepadan</option>
            ) : null}
            {filteredSchools.map((school) => (
              <option key={school.code} value={school.code}>
                {school.code} - {school.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>PKG</label>
          <input value={formatPkgZone(selectedSchool?.zone)} readOnly />
        </div>
        <div className="field">
          <label htmlFor="submitterName">Nama pengisi</label>
          <input
            id="submitterName"
            value={submitterName}
            onChange={(event) => setSubmitterName(event.target.value)}
            placeholder="Untuk rujukan admin sahaja"
          />
        </div>
        <div className="field">
          <label htmlFor="submitterPhone">Telefon pengisi</label>
          <input
            id="submitterPhone"
            value={submitterPhone}
            onChange={(event) => setSubmitterPhone(event.target.value)}
            placeholder="Untuk rujukan admin sahaja"
          />
        </div>
      </div>

      <section className="panel grid">
        <div>
          <h2 className="section-title">Pilih peranan untuk dikemas kini</h2>
          <p className="muted">
            Data sedia ada dimasukkan dahulu. Jika hanya ubah satu guru, data peranan lain akan kekal.
          </p>
        </div>
        <div className="role-picker">
          {roles.map((role) => (
            <button
              className={activeRole === role.key ? "role-tab active" : "role-tab"}
              key={role.key}
              type="button"
              onClick={() => setActiveRole(role.key)}
            >
              <span>{role.short}</span>
              <small>{roleState[role.key].teacherName || "Belum diisi"}</small>
            </button>
          ))}
        </div>

        <section className="role-card focused-role-card">
          <h3>{selectedRole.label}</h3>
          <div className="grid two">
            <div className="field">
              <label htmlFor={`${selectedRole.key}-name`}>Nama guru</label>
              <input
                id={`${selectedRole.key}-name`}
                value={roleState[selectedRole.key].teacherName}
                onChange={(event) =>
                  setRoleState((current) => ({
                    ...current,
                    [selectedRole.key]: {
                      ...current[selectedRole.key],
                      teacherName: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor={`${selectedRole.key}-phone`}>No. telefon</label>
              <input
                id={`${selectedRole.key}-phone`}
                value={roleState[selectedRole.key].phone}
                onChange={(event) =>
                  setRoleState((current) => ({
                    ...current,
                    [selectedRole.key]: {
                      ...current[selectedRole.key],
                      phone: event.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </section>
      </section>

      {error ? <p className="error">{error}</p> : null}
      <div className="actions">
        <button className="button" type="submit" disabled={isSaving || !selectedSchool}>
          {isSaving ? "Menyimpan..." : "Hantar Kemas Kini"}
        </button>
      </div>
    </form>
  );
}

function buildRoleStateForSchool(rows: PublicDirectoryRow[], schoolCode: string): RoleState {
  const next: RoleState = {
    GPICT: { teacherName: "", phone: "" },
    DELIMA: { teacherName: "", phone: "" },
    GPM: { teacherName: "", phone: "" },
  };

  for (const row of rows) {
    if (row.schoolCode !== schoolCode) continue;
    next[row.role] = {
      teacherName: row.teacherName,
      phone: row.phone,
    };
  }

  return next;
}
