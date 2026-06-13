import { describe, expect, it } from "vitest";
import { jsonNoStore } from "./http-cache";

describe("HTTP cache helpers", () => {
  it("returns JSON responses with no-store cache headers", async () => {
    const response = jsonNoStore({ ok: true });

    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe(
      "no-store, no-cache, max-age=0, must-revalidate",
    );
  });
});
