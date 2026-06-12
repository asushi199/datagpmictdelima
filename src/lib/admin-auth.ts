import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "manjung_admin_session";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function adminToken(): string {
  return crypto
    .createHash("sha256")
    .update(`manjung:${adminPassword()}`)
    .digest("hex");
}

export function isAdminPassword(value: string): boolean {
  const expected = adminPassword();
  return safeEqual(value, expected);
}

export function isAdminCookieValid(): boolean {
  return cookies().get(ADMIN_COOKIE)?.value === adminToken();
}

export function requireAdmin(): void {
  if (!isAdminCookieValid()) {
    redirect("/admin/login");
  }
}

export function isAdminRequest(request: NextRequest): boolean {
  return request.cookies.get(ADMIN_COOKIE)?.value === adminToken();
}

function safeEqual(input: string, expected: string): boolean {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}
