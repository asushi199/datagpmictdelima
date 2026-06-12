import Link from "next/link";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand">
          <h1>Log Masuk Admin</h1>
          <p>Masukkan kata laluan admin untuk melihat sejarah dan pemulihan data.</p>
        </div>
        <Link className="button secondary" href="/">
          Kembali
        </Link>
      </div>
      <AdminLoginForm />
    </main>
  );
}
