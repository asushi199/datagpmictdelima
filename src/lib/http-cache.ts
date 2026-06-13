import { NextResponse } from "next/server";

const NO_STORE_CACHE_CONTROL = "no-store, no-cache, max-age=0, must-revalidate";

export function jsonNoStore<TBody>(body: TBody, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", NO_STORE_CACHE_CONTROL);
  return response;
}
