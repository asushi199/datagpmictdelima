import { jsonNoStore } from "@/lib/http-cache";
import { listPublicDirectory } from "@/lib/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const rows = await listPublicDirectory();
  return jsonNoStore({ rows });
}
