import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPkgZone } from "@/lib/data-utils";
import { parseRoleParam, ROLE_FORM_OPTIONS } from "@/lib/role-config";
import { listAdminSchools } from "@/lib/repository";
import type { ExportListType, TeacherRole } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPrintPage({
  searchParams,
}: {
  searchParams: { type?: string; roles?: string };
}) {
  requireAdmin();
  const listType: ExportListType = searchParams.type === "schools" ? "schools" : "teachers";
  const roles = parseRoleParam(searchParams.roles);
  const schools = await listAdminSchools();
  const roleLabels = new Map(ROLE_FORM_OPTIONS.map((role) => [role.key, role.short]));
  const title = listType === "schools"
    ? "Senarai Sekolah Daerah Manjung"
    : `Senarai ${roles.map((role) => roleLabels.get(role) ?? role).join(", ")} Daerah Manjung`;

  return (
    <main className="print-shell">
      <div className="print-actions no-print">
        <Link className="button secondary" href="/admin">
          Kembali ke Admin
        </Link>
        <PrintButton />
      </div>

      <header className="print-header">
        <p>Pejabat Pendidikan Daerah Manjung</p>
        <h1>{title}</h1>
        <span>Dijana pada {new Date().toLocaleString("ms-MY")}</span>
      </header>

      {listType === "schools" ? (
        <table className="print-table">
          <thead>
            <tr>
              <th>Bil.</th>
              <th>Kod Sekolah</th>
              <th>Nama Sekolah</th>
              <th>PKG</th>
              <th>Peranan Diisi</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school, index) => (
              <tr key={school.schoolCode}>
                <td>{index + 1}</td>
                <td>{school.schoolCode}</td>
                <td>{school.schoolName}</td>
                <td>{formatPkgZone(school.zone)}</td>
                <td>{school.roles.filter((role) => role.teacherName || role.phone).length}/3</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="print-table">
          <thead>
            <tr>
              <th>Bil.</th>
              <th>Sekolah</th>
              <th>PKG</th>
              <th>Peranan</th>
              <th>Nama Guru</th>
              <th>No. Telefon</th>
            </tr>
          </thead>
          <tbody>
            {schools.flatMap((school) =>
              school.roles
                .filter((role) => roles.includes(role.role))
                .map((role) => ({ school, role })),
            ).map((item, index) => (
              <tr key={`${item.school.schoolCode}-${item.role.role}`}>
                <td>{index + 1}</td>
                <td>
                  <strong>{item.school.schoolName}</strong>
                  <br />
                  {item.school.schoolCode}
                </td>
                <td>{formatPkgZone(item.school.zone)}</td>
                <td>{roleLabels.get(item.role.role as TeacherRole) ?? item.role.role}</td>
                <td>{item.role.teacherName || "-"}</td>
                <td>{item.role.phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
