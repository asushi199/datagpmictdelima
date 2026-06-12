import "server-only";

import initialData from "@/data/initial-data.json";
import {
  buildPublicDirectory,
  chooseLatestBySchoolCode,
  cleanSchoolDisplayName,
  cleanSubmission,
  exportAdminCsv,
  normalizeSchoolCode,
} from "./data-utils";
import { getSupabaseAdmin } from "./supabase-server";
import type {
  CurrentSchoolRecord,
  ImportSubmission,
  PublicDirectoryRow,
  RoleContact,
  SchoolOption,
  TeacherRole,
  VersionRecord,
} from "./types";

type DbRole = {
  role: TeacherRole;
  teacher_name: string;
  phone: string;
};

type DbVersion = {
  id: string;
  school_code: string;
  school_name: string;
  zone: string;
  submitted_at: string;
  submitter_name: string | null;
  submitter_phone: string | null;
  source: string | null;
  is_hidden: boolean;
  contact_roles?: DbRole[];
};

type DbSchool = {
  code: string;
  name: string;
  zone: string;
  current_version_id: string | null;
};

const demoSubmissions = (initialData as ImportSubmission[]).map(cleanSubmission);

export async function listPublicDirectory(): Promise<PublicDirectoryRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return buildPublicDirectory(chooseLatestBySchoolCode(demoSubmissions));
  }

  const schools = await listDbSchools();
  const versions = await getVersionsByIds(
    schools.map((school) => school.current_version_id).filter(Boolean) as string[],
  );
  const versionById = new Map(versions.map((version) => [version.id, version]));

  return schools.flatMap((school) => {
    const version = school.current_version_id
      ? versionById.get(school.current_version_id)
      : null;
    return (version?.contact_roles ?? []).map((role) => ({
      schoolCode: school.code,
      schoolName: school.name,
      zone: school.zone,
      role: role.role,
      teacherName: role.teacher_name,
      phone: role.phone,
    }));
  });
}

export async function listSchoolOptions(): Promise<SchoolOption[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return chooseLatestBySchoolCode(demoSubmissions).map((item) => ({
      code: item.schoolCode,
      name: item.schoolName,
      zone: item.zone,
    }));
  }

  const schools = await listDbSchools();
  return schools.map((school) => ({
    code: school.code,
    name: school.name,
    zone: school.zone,
  }));
}

export async function listAdminSchools(): Promise<CurrentSchoolRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return chooseLatestBySchoolCode(demoSubmissions).map((submission) => ({
      schoolCode: submission.schoolCode,
      schoolName: submission.schoolName,
      zone: submission.zone,
      currentVersionId: null,
      submittedAt: submission.submittedAt,
      submitterName: submission.submitterName ?? null,
      submitterPhone: submission.submitterPhone ?? null,
      source: submission.source ?? "demo",
      roles: submission.roles,
    }));
  }

  const schools = await listDbSchools();
  const versions = await getVersionsByIds(
    schools.map((school) => school.current_version_id).filter(Boolean) as string[],
  );
  const versionById = new Map(versions.map((version) => [version.id, version]));

  return schools.map((school) => {
    const version = school.current_version_id
      ? versionById.get(school.current_version_id)
      : null;
    return {
      schoolCode: school.code,
      schoolName: school.name,
      zone: school.zone,
      currentVersionId: school.current_version_id,
      submittedAt: version?.submitted_at ?? null,
      submitterName: version?.submitter_name ?? null,
      submitterPhone: version?.submitter_phone ?? null,
      source: version?.source ?? null,
      roles: mapDbRoles(version?.contact_roles ?? []),
    };
  });
}

export async function getSchoolHistory(
  schoolCode: string,
): Promise<{ school: CurrentSchoolRecord | null; versions: VersionRecord[] }> {
  const code = normalizeSchoolCode(schoolCode);
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const all = demoSubmissions.filter((item) => item.schoolCode === code);
    const latest = chooseLatestBySchoolCode(all)[0] ?? null;
    return {
      school: latest
        ? {
            schoolCode: latest.schoolCode,
            schoolName: latest.schoolName,
            zone: latest.zone,
            currentVersionId: null,
            submittedAt: latest.submittedAt,
            submitterName: latest.submitterName ?? null,
            submitterPhone: latest.submitterPhone ?? null,
            source: latest.source ?? "demo",
            roles: latest.roles,
          }
        : null,
      versions: all
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
        .map((item, index) => ({
          id: `${item.schoolCode}-${item.submittedAt}`,
          schoolCode: item.schoolCode,
          schoolName: item.schoolName,
          zone: item.zone,
          submittedAt: item.submittedAt,
          submitterName: item.submitterName ?? null,
          submitterPhone: item.submitterPhone ?? null,
          source: item.source ?? "demo",
          isCurrent: index === 0,
          roles: item.roles,
        })),
    };
  }

  const { data: school, error: schoolError } = await supabase
    .from("schools")
    .select("code,name,zone,current_version_id")
    .eq("code", code)
    .single<DbSchool>();
  if (schoolError) throw schoolError;

  const { data: versions, error } = await supabase
    .from("contact_versions")
    .select("id,school_code,school_name,zone,submitted_at,submitter_name,submitter_phone,source,is_hidden,contact_roles(role,teacher_name,phone)")
    .eq("school_code", code)
    .order("submitted_at", { ascending: false })
    .returns<DbVersion[]>();
  if (error) throw error;

  const mappedVersions = (versions ?? []).map((version) => mapVersion(version, school));
  const current = mappedVersions.find((version) => version.isCurrent) ?? mappedVersions[0];

  return {
    school: current
      ? {
          schoolCode: school.code,
          schoolName: school.name,
          zone: school.zone,
          currentVersionId: school.current_version_id,
          submittedAt: current.submittedAt,
          submitterName: current.submitterName,
          submitterPhone: current.submitterPhone,
          source: current.source,
          roles: current.roles,
        }
      : null,
    versions: mappedVersions,
  };
}

export async function createSubmission(submission: ImportSubmission): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Sila tambah env Supabase dahulu.");
  }

  const clean = cleanSubmission(submission);
  if (!clean.schoolCode || !clean.schoolName) {
    throw new Error("Kod sekolah dan nama sekolah diperlukan.");
  }

  const { error: schoolError } = await supabase.from("schools").upsert({
    code: clean.schoolCode,
    name: clean.schoolName,
    zone: clean.zone,
  });
  if (schoolError) throw schoolError;

  const { data: version, error: versionError } = await supabase
    .from("contact_versions")
    .insert({
      school_code: clean.schoolCode,
      school_name: clean.schoolName,
      zone: clean.zone,
      submitted_at: clean.submittedAt,
      submitter_name: clean.submitterName,
      submitter_phone: clean.submitterPhone,
      source: clean.source,
    })
    .select("id")
    .single<{ id: string }>();
  if (versionError) throw versionError;

  const { error: rolesError } = await supabase.from("contact_roles").insert(
    clean.roles.map((role) => ({
      version_id: version.id,
      role: role.role,
      teacher_name: role.teacherName,
      phone: role.phone,
    })),
  );
  if (rolesError) throw rolesError;

  const { error: updateError } = await supabase
    .from("schools")
    .update({
      name: clean.schoolName,
      zone: clean.zone,
      current_version_id: version.id,
    })
    .eq("code", clean.schoolCode);
  if (updateError) throw updateError;
}

export async function restoreVersion(versionId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const { data: version, error: versionError } = await supabase
    .from("contact_versions")
    .select("id,school_code,school_name,zone")
    .eq("id", versionId)
    .single<{ id: string; school_code: string; school_name: string; zone: string }>();
  if (versionError) throw versionError;

  const { error: updateError } = await supabase
    .from("schools")
    .update({
      name: version.school_name,
      zone: version.zone,
      current_version_id: version.id,
    })
    .eq("code", version.school_code);
  if (updateError) throw updateError;

  await supabase.from("admin_actions").insert({
    action: "restore_version",
    school_code: version.school_code,
    version_id: version.id,
  });

  return version.school_code;
}

export async function updateSchoolName(schoolCode: string, nextName: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const code = normalizeSchoolCode(schoolCode);
  const name = cleanSchoolDisplayName(nextName);
  if (!code || !name) {
    throw new Error("Kod sekolah dan nama sekolah diperlukan.");
  }

  const { error: schoolError } = await supabase
    .from("schools")
    .update({ name })
    .eq("code", code);
  if (schoolError) throw schoolError;

  const { error: versionError } = await supabase
    .from("contact_versions")
    .update({ school_name: name })
    .eq("school_code", code);
  if (versionError) throw versionError;

  await supabase.from("admin_actions").insert({
    action: "update_school_name",
    school_code: code,
  });

  return code;
}

export async function exportCurrentAdminCsv(): Promise<string> {
  const current = await listAdminSchools();
  return exportAdminCsv(
    current.map((school) => ({
      submittedAt: school.submittedAt ?? "",
      schoolCode: school.schoolCode,
      schoolName: school.schoolName,
      zone: school.zone,
      submitterName: school.submitterName,
      submitterPhone: school.submitterPhone,
      source: school.source,
      roles: school.roles,
    })),
  );
}

async function listDbSchools(): Promise<DbSchool[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("schools")
    .select("code,name,zone,current_version_id")
    .order("code")
    .returns<DbSchool[]>();
  if (error) throw error;
  return data ?? [];
}

async function getVersionsByIds(ids: string[]): Promise<DbVersion[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase || ids.length === 0) return [];
  const { data, error } = await supabase
    .from("contact_versions")
    .select("id,school_code,school_name,zone,submitted_at,submitter_name,submitter_phone,source,is_hidden,contact_roles(role,teacher_name,phone)")
    .in("id", ids)
    .returns<DbVersion[]>();
  if (error) throw error;
  return data ?? [];
}

function mapDbRoles(roles: DbRole[]): RoleContact[] {
  const order: TeacherRole[] = ["GPICT", "DELIMA", "GPM"];
  return roles
    .map((role) => ({
      role: role.role,
      teacherName: role.teacher_name,
      phone: role.phone,
    }))
    .sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role));
}

function mapVersion(version: DbVersion, school: DbSchool): VersionRecord {
  return {
    id: version.id,
    schoolCode: version.school_code,
    schoolName: version.school_name,
    zone: version.zone,
    submittedAt: version.submitted_at,
    submitterName: version.submitter_name,
    submitterPhone: version.submitter_phone,
    source: version.source,
    isCurrent: version.id === school.current_version_id,
    roles: mapDbRoles(version.contact_roles ?? []),
  };
}
