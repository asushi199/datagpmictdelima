import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { exportCurrentAdminCsv } from "@/lib/repository";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, message: "Tidak dibenarkan." }, { status: 401 });
  }

  const csv = await exportCurrentAdminCsv();
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="guru-manjung-current.csv"',
    },
  });
}
