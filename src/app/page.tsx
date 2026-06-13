import Image from "next/image";
import Link from "next/link";
import { ROLE_PORTAL_CARDS } from "@/lib/role-config";
import { listPublicDirectory } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await listPublicDirectory();
  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(row.role, (counts.get(row.role) ?? 0) + 1));

  return (
    <main className="shell portal-shell">
      <div className="topbar portal-topbar">
        <div className="brand brand-with-logo">
          <Image src="/ustp-logo.png" alt="Logo USTP Manjung" className="site-logo" width={82} height={82} priority />
          <div>
            <h1>Direktori GPICT, GP DELIMa & GPM Manjung</h1>
            <p>Pilih direktori mengikut peranan. Setiap halaman mempunyai carian dan sorting sendiri.</p>
          </div>
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
          Mod demo: laman sedang membaca data awal tempatan. Untuk kemas kini sebenar, sambungkan Supabase.
        </div>
      ) : null}

      <section className="portal-grid">
        {ROLE_PORTAL_CARDS.map((card) => (
          <Link className={card.className} href={card.href} key={card.href}>
            <span>{card.subtitle}</span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <strong>{counts.get(card.role) ?? 0} rekod</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
