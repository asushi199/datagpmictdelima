import { describe, expect, it } from "vitest";
import {
  buildPublicDirectory,
  chooseLatestBySchoolCode,
  exportAdminCsv,
  normalizeSchoolCode,
  normalizeSchoolName,
} from "./data-utils";
import type { ImportSubmission } from "./types";

const submissions: ImportSubmission[] = [
  {
    submittedAt: "2025-02-19T08:00:00.000Z",
    schoolCode: " ABA 1025 ",
    schoolName: "SK Kampong Baharu",
    zone: "AYER TAWAR",
    submitterName: "Kerani Lama",
    submitterPhone: "0111111111",
    roles: [
      { role: "GPICT", teacherName: "Guru Lama", phone: "0121111111" },
      { role: "DELIMA", teacherName: "Guru Delima", phone: "0131111111" },
      { role: "GPM", teacherName: "Guru Pusat Sumber", phone: "0141111111" },
    ],
  },
  {
    submittedAt: "2025-02-20T08:00:00.000Z",
    schoolCode: "ABA1025",
    schoolName: "SK Kampung Baharu",
    zone: "AYER TAWAR",
    submitterName: "Kerani Baru",
    submitterPhone: "0199999999",
    roles: [
      { role: "GPICT", teacherName: "Guru Baru", phone: "0122222222" },
      { role: "DELIMA", teacherName: "Guru Delima", phone: "0131111111" },
      { role: "GPM", teacherName: "Guru Pusat Sumber", phone: "0141111111" },
    ],
  },
];

describe("data utilities", () => {
  it("normalizes school codes and common school-name variants", () => {
    expect(normalizeSchoolCode(" ABA 1025 ")).toBe("ABA1025");
    expect(normalizeSchoolName("Sekolah Kebangsaan Kampong Baharu")).toBe(
      "SK KAMPUNG BAHARU",
    );
    expect(normalizeSchoolName("SJK(C) Sungai Batu")).toBe("SJKC SUNGAI BATU");
  });

  it("selects the latest submission for each cleaned school code", () => {
    const latest = chooseLatestBySchoolCode(submissions);
    expect(latest).toHaveLength(1);
    expect(latest[0].schoolCode).toBe("ABA1025");
    expect(latest[0].roles[0].teacherName).toBe("Guru Baru");
  });

  it("builds public rows without submitter or history-only fields", () => {
    const rows = buildPublicDirectory(chooseLatestBySchoolCode(submissions));
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({
      schoolCode: "ABA1025",
      schoolName: "SK Kampung Baharu",
      zone: "AYER TAWAR",
      role: "GPICT",
      teacherName: "Guru Baru",
      phone: "0122222222",
    });
    expect(JSON.stringify(rows)).not.toContain("Kerani");
  });

  it("exports admin CSV with current roles and submitter fields", () => {
    const csv = exportAdminCsv(chooseLatestBySchoolCode(submissions));
    expect(csv).toContain("school_code,school_name,zone,role,teacher_name,phone");
    expect(csv).toContain("ABA1025,SK Kampung Baharu,AYER TAWAR,GPICT,Guru Baru,0122222222");
    expect(csv).toContain("Kerani Baru");
  });
});
