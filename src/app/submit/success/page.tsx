import Link from "next/link";

export default function SubmitSuccessPage() {
  return (
    <main className="shell">
      <section className="panel grid">
        <div className="brand">
          <h1>Terima kasih</h1>
          <p>Data sekolah telah diterima dan akan dipaparkan sebagai maklumat terkini.</p>
        </div>
        <div className="actions">
          <Link className="button" href="/">
            Lihat Direktori
          </Link>
          <Link className="button secondary" href="/submit">
            Hantar Sekolah Lain
          </Link>
        </div>
      </section>
    </main>
  );
}
