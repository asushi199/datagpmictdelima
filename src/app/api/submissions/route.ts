import { jsonNoStore } from "@/lib/http-cache";
import { createSubmission } from "@/lib/repository";
import { ROLE_ORDER } from "@/lib/role-config";
import type { ImportSubmission } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submission: ImportSubmission = {
      submittedAt: new Date().toISOString(),
      schoolCode: String(body.schoolCode ?? ""),
      schoolName: String(body.schoolName ?? ""),
      zone: String(body.zone ?? ""),
      submitterName: String(body.submitterName ?? ""),
      submitterPhone: String(body.submitterPhone ?? ""),
      source: "public_form",
      roles: ROLE_ORDER.map((role) => ({
        role,
        teacherName: String(body.roles?.[role]?.teacherName ?? ""),
        phone: String(body.roles?.[role]?.phone ?? ""),
      })),
    };

    await createSubmission(submission);
    return jsonNoStore({ ok: true });
  } catch (error) {
    return jsonNoStore(
      { ok: false, message: error instanceof Error ? error.message : "Ralat tidak diketahui." },
      { status: 400 },
    );
  }
}
