import Link from "next/link";
import { EditSchoolNameForm } from "@/components/EditSchoolNameForm";
import { RestoreButton } from "@/components/RestoreButton";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPkgZone } from "@/lib/data-utils";
import { getSchoolHistory } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminSchoolPage({ params }: { params: { code: string } }) {
  requireAdmin();
  const { school, versions } = await getSchoolHistory(params.code);

  if (!school) {
    return (
      <main className="shell">
        <div className="panel grid">
          <h1>Rekod tidak ditemui</h1>
          <Link className="button secondary" href="/admin">
            Kembali ke Admin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">
          <h1>{school.schoolName}</h1>
          <p>
            {school.schoolCode} - {formatPkgZone(school.zone)}
          </p>
        </div>
        <Link className="button secondary" href="/admin">
          Kembali
        </Link>
      </div>

      <section className="panel grid">
        <h2>Edit Maklumat Sekolah</h2>
        <EditSchoolNameForm schoolCode={school.schoolCode} schoolName={school.schoolName} />
      </section>

      <div style={{ height: 16 }} />

      <section className="panel grid">
        <h2>Data Semasa</h2>
        <div className="grid three">
          {school.roles.map((role) => (
            <div className="role-card" key={role.role}>
              <span className="badge">{role.role}</span>
              <strong>{role.teacherName || "-"}</strong>
              <span>{role.phone || "-"}</span>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 16 }} />

      <section className="grid">
        <h2>Sejarah Kemas Kini</h2>
        {versions.map((version) => (
          <article className="panel grid" key={version.id}>
            <div className="topbar" style={{ marginBottom: 0 }}>
              <div>
                <strong>{new Date(version.submittedAt).toLocaleString("ms-MY")}</strong>
                {version.isCurrent ? <span className="badge" style={{ marginLeft: 8 }}>Semasa</span> : null}
                <div className="muted">
                  Pengisi: {version.submitterName || "-"} - Telefon: {version.submitterPhone || "-"}
                </div>
              </div>
              {!version.isCurrent && isSupabaseConfigured() ? (
                <RestoreButton versionId={version.id} />
              ) : null}
            </div>
            <div className="grid three">
              {version.roles.map((role) => (
                <div className="role-card" key={`${version.id}-${role.role}`}>
                  <span className="badge">{role.role}</span>
                  <strong>{role.teacherName || "-"}</strong>
                  <span>{role.phone || "-"}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
