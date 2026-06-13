import { describe, expect, it } from "vitest";
import { ROLE_FORM_OPTIONS, ROLE_ORDER, ROLE_PORTAL_CARDS } from "./role-config";

describe("role configuration", () => {
  it("keeps portal cards, form tabs, and data order aligned", () => {
    expect(ROLE_ORDER).toEqual(["GPM", "GPICT", "DELIMA"]);
    expect(ROLE_PORTAL_CARDS.map((card) => card.role)).toEqual(ROLE_ORDER);
    expect(ROLE_FORM_OPTIONS.map((option) => option.key)).toEqual(ROLE_ORDER);
  });
});
