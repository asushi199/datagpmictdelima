import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPkgZone } from "@/lib/data-utils";
import { listAdminSchools } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  requireAdmin();
  const schools = await listAdminSchools();

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">
          <h1>Admin Data Guru</h1>
          <p>{schools.length} sekolah dalam senarai semasa.</p>
        </div>
        <div className="actions">
          <a className="button" href="/api/admin/export">
            Export CSV
          </a>
          <Link className="button secondary" href="/">
            Direktori
          </Link>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="notice">
          Mod demo: sejarah dipaparkan daripada fail import tempatan. Fungsi restore sebenar
          memerlukan Supabase.
        </div>
      ) : null}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sekolah</th>
              <th>PKG</th>
              <th>Kemaskini Terakhir</th>
              <th>Peranan Diisi</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.schoolCode}>
                <td>
                  <strong>{school.schoolName}</strong>
                  <div className="muted">{school.schoolCode}</div>
                </td>
                <td>{formatPkgZone(school.zone)}</td>
                <td>{school.submittedAt ? new Date(school.submittedAt).toLocaleString("ms-MY") : "-"}</td>
                <td>{school.roles.filter((role) => role.teacherName || role.phone).length}/3</td>
                <td>
                  <Link className="button secondary" href={`/admin/schools/${school.schoolCode}`}>
                    Sejarah
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
