export type TeacherRole = "GPICT" | "DELIMA" | "GPM";

export type RoleContact = {
  role: TeacherRole;
  teacherName: string;
  phone: string;
};

export type ImportSubmission = {
  submittedAt: string;
  schoolCode: string;
  schoolName: string;
  zone: string;
  submitterName?: string | null;
  submitterPhone?: string | null;
  source?: string | null;
  roles: RoleContact[];
};

export type PublicDirectoryRow = {
  schoolCode: string;
  schoolName: string;
  zone: string;
  role: TeacherRole;
  teacherName: string;
  phone: string;
};

export type SchoolOption = {
  code: string;
  name: string;
  zone: string;
};

export type CurrentSchoolRecord = {
  schoolCode: string;
  schoolName: string;
  zone: string;
  currentVersionId: string | null;
  submittedAt: string | null;
  submitterName: string | null;
  submitterPhone: string | null;
  source: string | null;
  roles: RoleContact[];
};

export type RecentUpdateRecord = {
  id: string;
  schoolCode: string;
  schoolName: string;
  zone: string;
  submittedAt: string;
  submitterName: string | null;
  submitterPhone: string | null;
  filledRoleCount: number;
};

export type VersionRecord = {
  id: string;
  schoolCode: string;
  schoolName: string;
  zone: string;
  submittedAt: string;
  submitterName: string | null;
  submitterPhone: string | null;
  source: string | null;
  isCurrent: boolean;
  roles: RoleContact[];
};
