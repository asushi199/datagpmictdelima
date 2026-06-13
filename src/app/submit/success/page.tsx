export default function SubmitSuccessPage() {
  return (
    <main className="shell">
      <section className="panel grid">
        <div className="brand">
          <h1>Terima kasih</h1>
          <p>Data sekolah telah diterima dan akan dipaparkan sebagai maklumat terkini.</p>
        </div>
        <div className="actions">
          <a className="button" href="/">
            Lihat Direktori
          </a>
          <a className="button secondary" href="/submit">
            Hantar Sekolah Lain
          </a>
        </div>
      </section>
    </main>
  );
}
