import { RoleDirectory } from "@/components/RoleDirectory";
import { listPublicDirectory } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function GpmPage() {
  const rows = await listPublicDirectory();
  return <RoleDirectory rows={rows} role="GPM" variant="gpm" />;
}
