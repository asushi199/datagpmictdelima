import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPkgZone } from "@/lib/data-utils";
import { listAdminSchools, listRecentUpdates } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  requireAdmin();
  const [schools, recentUpdates] = await Promise.all([
    listAdminSchools(),
    listRecentUpdates(20),
  ]);

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

      <section className="panel grid">
        <div>
          <h2 className="section-title">Kemas Kini Terkini</h2>
          <p className="muted">20 penghantaran terbaru untuk semakan admin.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Masa</th>
                <th>Sekolah</th>
                <th>Pengisi</th>
                <th>Peranan Diisi</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {recentUpdates.map((update) => (
                <tr key={update.id}>
                  <td>{new Date(update.submittedAt).toLocaleString("ms-MY")}</td>
                  <td>
                    <strong>{update.schoolName}</strong>
                    <div className="muted">
                      {update.schoolCode} - {formatPkgZone(update.zone)}
                    </div>
                  </td>
                  <td>
                    {update.submitterName || "-"}
                    <div className="muted">{update.submitterPhone || "-"}</div>
                  </td>
                  <td>{update.filledRoleCount}/3</td>
                  <td>
                    <Link className="button secondary" href={`/admin/schools/${update.schoolCode}`}>
                      Sejarah
                    </Link>
                  </td>
                </tr>
              ))}
              {recentUpdates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    Tiada kemas kini untuk dipaparkan.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <div style={{ height: 16 }} />

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
