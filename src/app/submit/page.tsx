import Link from "next/link";
import { SubmitForm } from "@/components/SubmitForm";
import { listPublicDirectory, listSchoolOptions } from "@/lib/repository";
import { isSupabaseConfigured } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const [schools, currentRows] = await Promise.all([listSchoolOptions(), listPublicDirectory()]);

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">
          <h1>Kemas Kini Data Sekolah</h1>
          <p>Pilih kod sekolah dahulu, kemudian ubah peranan yang berkaitan sahaja.</p>
        </div>
        <Link className="button secondary" href="/">
          Kembali
        </Link>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="notice">
          Supabase belum dikonfigurasi. Borang boleh dilihat, tetapi penghantaran sebenar
          memerlukan environment Supabase.
        </div>
      ) : null}

      <SubmitForm schools={schools} currentRows={currentRows} />
    </main>
  );
}
