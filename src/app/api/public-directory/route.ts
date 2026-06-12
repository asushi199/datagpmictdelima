import { NextResponse } from "next/server";
import { listPublicDirectory } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listPublicDirectory();
  return NextResponse.json({ rows });
}
