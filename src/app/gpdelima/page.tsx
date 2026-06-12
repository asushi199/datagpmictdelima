import { RoleDirectory } from "@/components/RoleDirectory";
import { listPublicDirectory } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function GpdelimaPage() {
  const rows = await listPublicDirectory();
  return <RoleDirectory rows={rows} role="DELIMA" variant="gpdelima" />;
}
