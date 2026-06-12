import Link from "next/link";
import { PublicDirectory } from "@/components/PublicDirectory";
import { listPublicDirectory } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await listPublicDirectory();

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">
          <h1>Direktori Guru ICT, DELIMa & GPM Manjung</h1>
          <p>Senarai asas untuk rujukan sekolah dan PPD Manjung.</p>
        </div>
        <div className="actions">
          <Link className="button" href="/submit">
            Kemas Kini Data
          </Link>
          <Link className="button secondary" href="/admin">
            Admin
          </Link>
        </div>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="notice">
          Mod demo: laman sedang membaca data awal daripada Excel tempatan. Untuk kemas kini
          sebenar, sambungkan Supabase di fail environment.
        </div>
      ) : null}

      <PublicDirectory rows={rows} />
    </main>
  );
}
