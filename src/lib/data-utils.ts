import type { ImportSubmission, PublicDirectoryRow } from "./types";

export function normalizeSchoolCode(value: string | null | undefined): string {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function formatPkgZone(value: string | null | undefined): string {
  const text = String(value ?? "").trim();
  if (!text) return "-";
  return text.toUpperCase().startsWith("PKG ") ? text : `PKG ${text}`;
}

export function normalizeSchoolName(value: string | null | undefined): string {
  let text = String(value ?? "").toUpperCase().trim();
  text = text
    .replace(/SJK\(C\)|SJK \(C\)|SJK C/g, "SJKC")
    .replace(/SJK\(T\)|SJK \(T\)|SJK T/g, "SJKT")
    .replace(/SEKOLAH JENIS KEBANGSAAN CINA/g, "SJKC")
    .replace(/SEKOLAH JENIS KEBANGSAAN TAMIL/g, "SJKT")
    .replace(/SEKOLAH MENENGAH KEBANGSAAN/g, "SMK")
    .replace(/SEKOLAH KEBANGSAAN/g, "SK")
    .replace(/KAMPONG/g, "KAMPUNG")
    .replace(/KG\./g, "KAMPUNG")
    .replace(/KG /g, "KAMPUNG ")
    .replace(/KPG/g, "KAMPUNG")
    .replace(/NENAS/g, "NANAS")
    .replace(/ĄŻ/g, "")
    .replace(/'/g, "")
    .replace(/\./g, "")
    .replace(/-/g, " ");
  text = text.replace(/\s*,.*$/g, "");
  text = text.replace(/\([^)]*\)/g, "");
  return text.replace(/\s+/g, " ").trim();
}

export function cleanSubmission(submission: ImportSubmission): ImportSubmission {
  return {
    ...submission,
    schoolCode: normalizeSchoolCode(submission.schoolCode),
    schoolName: submission.schoolName.trim(),
    zone: submission.zone.trim(),
    submitterName: emptyToNull(submission.submitterName),
    submitterPhone: emptyToNull(submission.submitterPhone),
    source: emptyToNull(submission.source),
    roles: submission.roles.map((role) => ({
      ...role,
      teacherName: role.teacherName.trim(),
      phone: role.phone.trim(),
    })),
  };
}

export function chooseLatestBySchoolCode(
  submissions: ImportSubmission[],
): ImportSubmission[] {
  const latest = new Map<string, ImportSubmission>();

  for (const raw of submissions) {
    const submission = cleanSubmission(raw);
    if (!submission.schoolCode) {
      continue;
    }

    const existing = latest.get(submission.schoolCode);
    if (!existing || submission.submittedAt > existing.submittedAt) {
      latest.set(submission.schoolCode, submission);
    }
  }

  return [...latest.values()].sort((a, b) =>
    a.schoolName.localeCompare(b.schoolName),
  );
}

export function buildPublicDirectory(
  currentSubmissions: ImportSubmission[],
): PublicDirectoryRow[] {
  return currentSubmissions.flatMap((submission) =>
    submission.roles.map((role) => ({
      schoolCode: normalizeSchoolCode(submission.schoolCode),
      schoolName: submission.schoolName,
      zone: submission.zone,
      role: role.role,
      teacherName: role.teacherName,
      phone: role.phone,
    })),
  );
}

export function exportAdminCsv(currentSubmissions: ImportSubmission[]): string {
  const header = [
    "school_code",
    "school_name",
    "zone",
    "role",
    "teacher_name",
    "phone",
    "submitted_at",
    "submitter_name",
    "submitter_phone",
    "source",
  ];
  const rows = currentSubmissions.flatMap((submission) =>
    submission.roles.map((role) => [
      normalizeSchoolCode(submission.schoolCode),
      submission.schoolName,
      submission.zone,
      role.role,
      role.teacherName,
      role.phone,
      submission.submittedAt,
      submission.submitterName ?? "",
      submission.submitterPhone ?? "",
      submission.source ?? "",
    ]),
  );

  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function emptyToNull(value: string | null | undefined): string | null {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function csvCell(value: string): string {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}
