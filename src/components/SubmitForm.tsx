"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SchoolOption, TeacherRole } from "@/lib/types";

const roles: { key: TeacherRole; label: string }[] = [
  { key: "GPICT", label: "Guru Penyelaras ICT" },
  { key: "DELIMA", label: "Guru Penyelaras DELIMa" },
  { key: "GPM", label: "Guru Perpustakaan dan Media" },
];

type RoleState = Record<TeacherRole, { teacherName: string; phone: string }>;

export function SubmitForm({ schools }: { schools: SchoolOption[] }) {
  const router = useRouter();
  const [schoolCode, setSchoolCode] = useState(schools[0]?.code ?? "");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterPhone, setSubmitterPhone] = useState("");
  const [roleState, setRoleState] = useState<RoleState>({
    GPICT: { teacherName: "", phone: "" },
    DELIMA: { teacherName: "", phone: "" },
    GPM: { teacherName: "", phone: "" },
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedSchool = useMemo(
    () => schools.find((school) => school.code === schoolCode),
    [schoolCode, schools],
  );

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

  return (
    <form className="grid" onSubmit={onSubmit}>
      <div className="panel grid two">
        <div className="field">
          <label htmlFor="school">Sekolah</label>
          <select
            id="school"
            value={schoolCode}
            onChange={(event) => setSchoolCode(event.target.value)}
            required
          >
            {schools.map((school) => (
              <option key={school.code} value={school.code}>
                {school.name} ({school.code})
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Zon</label>
          <input value={selectedSchool?.zone ?? ""} readOnly />
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

      <div className="grid three">
        {roles.map((role) => (
          <section className="role-card" key={role.key}>
            <h3>{role.label}</h3>
            <div className="field">
              <label htmlFor={`${role.key}-name`}>Nama guru</label>
              <input
                id={`${role.key}-name`}
                value={roleState[role.key].teacherName}
                onChange={(event) =>
                  setRoleState((current) => ({
                    ...current,
                    [role.key]: {
                      ...current[role.key],
                      teacherName: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor={`${role.key}-phone`}>No. telefon</label>
              <input
                id={`${role.key}-phone`}
                value={roleState[role.key].phone}
                onChange={(event) =>
                  setRoleState((current) => ({
                    ...current,
                    [role.key]: {
                      ...current[role.key],
                      phone: event.target.value,
                    },
                  }))
                }
              />
            </div>
          </section>
        ))}
      </div>

      {error ? <p className="error">{error}</p> : null}
      <div className="actions">
        <button className="button" type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Hantar Kemas Kini"}
        </button>
      </div>
    </form>
  );
}
