import Image from "next/image";
import Link from "next/link";
import { listPublicDirectory } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const cards = [
  {
    href: "/gpm",
    className: "portal-card portal-gpm",
    title: "GPM",
    subtitle: "Guru Perpustakaan dan Media",
    description: "Paparan berfokus untuk guru perpustakaan, media dan pusat sumber sekolah.",
  },
  {
    href: "/gpict",
    className: "portal-card portal-gpict",
    title: "GPICT",
    subtitle: "Guru Penyelaras ICT",
    description: "Paparan kemas untuk rujukan penyelaras ICT setiap sekolah.",
  },
  {
    href: "/gpdelima",
    className: "portal-card portal-gpdelima",
    title: "GP DELIMa",
    subtitle: "Guru Penyelaras DELIMa",
    description: "Paparan khusus untuk penyelaras DELIMa dan pembelajaran digital.",
  },
];

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
        {cards.map((card) => (
          <Link className={card.className} href={card.href} key={card.href}>
            <span>{card.subtitle}</span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <strong>{counts.get(card.title === "GP DELIMa" ? "DELIMA" : card.title) ?? 0} rekod</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
