import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { parseRoleParam } from "@/lib/role-config";
import { exportCurrentAdminCsv } from "@/lib/repository";
import type { ExportListType } from "@/lib/types";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, message: "Tidak dibenarkan." }, { status: 401 });
  }

  const listType = request.nextUrl.searchParams.get("type") === "schools"
    ? "schools"
    : "teachers";
  const roles = parseRoleParam(request.nextUrl.searchParams.get("roles"));
  const csv = await exportCurrentAdminCsv({ listType: listType as ExportListType, roles });
  const suffix = listType === "schools" ? "senarai-sekolah" : roles.join("-").toLowerCase();
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="guru-manjung-${suffix}.csv"`,
    },
  });
}
