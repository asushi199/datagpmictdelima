import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { restoreVersion } from "@/lib/repository";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, message: "Tidak dibenarkan." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schoolCode = await restoreVersion(String(body.versionId ?? ""));
    return NextResponse.json({ ok: true, schoolCode });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Ralat tidak diketahui." },
      { status: 400 },
    );
  }
}
